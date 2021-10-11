require("dotenv").config();
const { MongoClient } = require("mongodb");
const _ = require("lodash");
const { bins, getReversedBins } = require("../data/bins");
const {
  wassiesQuery,
  outcastsQuery,
  couchesQuery,
} = require("../data/queries");
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const traitsCollection = client
  .db("loomlock")
  .collection("loomlocknft_traitmap");
const rawdataCollection = client
  .db("loomlock")
  .collection("loomlocknft_rawdata");

async function generateTraitCounts(wassieQuery, wassieType, writeToDb = false) {
  if (writeToDb) {
    // If starting over, delete old records
    await traitsCollection.deleteMany({ wassie_type: wassieType });
  }

  // Grab all documents from the specified collection (e.g. wassies, outcasts)
  let documents = await rawdataCollection.find(wassieQuery).project({
    _id: 0,
    name: 0,
    image: 0,
    attributes: 0,
  });

  // Convert mongo cursor to array
  let documentsArray = await documents.toArray();

  /* Loop through all the documents in the array, and count the occurrences of each value of the Traits
   Put the counts into an object with shape: 
   {
    Body: 
      {
        "Normal":3000,
        "Skeleton":54,
        ...
      },
    Eyes: 
      {
        "Almond":323,
        "hmmm?": 259,
        ...
      },
    ...
  }
  */
  let traitCounts = documentsArray.reduce((obj, wassie) => {
    for (const trait in wassie) {
      if (!obj[trait]) obj[trait] = {};
      if (!obj[trait][wassie[trait]]) {
        obj[trait][wassie[trait]] = 1;
      } else {
        obj[trait][wassie[trait]] += 1;
      }
    }
    return obj;
  }, {});

  let traitCountDocs = [];

  /**
   * Loop through all the traits and values from the object created above.
   * Create a trait document with the shape:
   * {
   *  _id
   *  wassie_type
   *  trait_type
   *  value
   *  count
   *  pct
   *  bin
   * }
   */
  for (const trait in traitCounts) {
    let binList = getReversedBins(wassieType, trait);
    for (const traitValue in traitCounts[trait]) {
      let traitCountDoc = {
        _id: `${wassieType}_${trait}_${traitValue}`,
        wassie_type: wassieType,
        trait_type: trait,
        value: traitValue,
        count: traitCounts[trait][traitValue],
        pct: traitCounts[trait][traitValue] / documentsArray.length,
        score: 1 / (traitCounts[trait][traitValue] / documentsArray.length),
        bin: binList?.[traitValue],
      };
      traitCountDocs.push(traitCountDoc);
    }
  }

  if (writeToDb) {
    // Write each trait document to the traits collection in the database
    let res = await traitsCollection.insertMany(traitCountDocs, {
      ordered: false,
    });
  }

  /**
   * For each trait document, check the trait (e.g. Eyes) and trait value (e.g. Eyelashes) to see if it appears in the 'bins' object.
   * If so, start counting the number of trait value occurrences for each bin
   */
  let binCount = traitCountDocs.reduce((binDoc, traitDoc) => {
    if (traitDoc.bin) {
      let count = _.get(binDoc, `${traitDoc.trait_type}.${traitDoc.bin}`, 0);
      count += traitDoc.count;
      _.set(binDoc, `${traitDoc.trait_type}.${traitDoc.bin}`, count);
    }

    return binDoc;
  }, {});

  /**
   * For every trait value that appears in a bin, add the bin label, bin count, and bin percent to the trait document
   * then update the document in the database.
   */
  if (binCount) {
    for (const trait in binCount) {
      for (const binName in binCount[trait]) {
        if (writeToDb) {
          await traitsCollection.updateMany(
            {
              wassie_type: wassieType,
              trait_type: trait,
              bin: binName,
            },
            {
              $set: {
                binCnt: binCount[trait][binName],
                binPct: binCount[trait][binName] / documentsArray.length,
                score: 1 / (binCount[trait][binName] / documentsArray.length),
              },
            }
          );
        }
      }
    }
  }
}

async function generateRarityDocs(wassieCollection, wassieType, writeToDb) {
  if (writeToDb) {
    await loomlockraritiesCollection.deleteMany({ wassie_type: wassieType });
  }

  let documents = await wassieCollection.find({}).toArray();
  let traitNames = _.without(Object.keys(documents[0]), "_id", "name", "image");

  for (const doc of documents) {
    let newDocument = {
      _id: doc._id,
      name: doc.name,
      image: doc.image,
      wassie_type: wassieType,
    };
    for (const trait of traitNames) {
      newDocument[trait] = await traitsCollection.findOne(
        {
          wassie_type: wassieType,
          trait_type: trait,
          value: doc[trait],
        },
        { project: { _id: 0, wassie_type: 0 } }
      );
    }

    if (writeToDb) {
      console.log("Inserting Wassie ", newDocument._id);
      await loomlockraritiesCollection.insertOne(newDocument);
    }
  }

  console.log("done");
}

(async () => {
  client.connect(async (err) => {
    /* 
     Creates documents for the "Traits" collection in the database.

      Document Schema: 
      {
        _id: <wassie_type>_<trait>_<value> (unique)
        wassie_type: One of [wassies, outcasts, couches, looksrare]
        trait_type: Body, Feet, etc...
        value: Fuzzy, Pointy, Eyelashes, Blue, Skeleton, etc..
        count: The numer of times the trait appears for the wassie_type (e.g. 134 "Eyelashes" outcast eyes)
        pct: The percent value of the trait count (e.g. 43 Eyelashes/1000 outcasts = .043)
        bin: The bin name (e.g. "common", "rare"), if the trait value is grouped in a "bin" (otherwise undefined)
        binCnt: The total count of all items in the bin (e.g. 735 "common" Eyes for outcasts)
        binPct: The percent value of the bin for a wassie type (e.g. 735/1000 "common" eyes for outcasts)
        score: The score (1/pct|binPct)
        adjustedScore: Score pulled from Loomlock official scoring data
      }

      generateTraitCounts loops through each collection of wassie types (regular "wassies", outcasts, couches, and 1 of 1s - aka "looksrare").
      Each wassie type has its own view in the database. See the queries.js for the selection criteria for each wassie type.
      While looping though the records, each trait value is counted. At the end of the process, the "traits" collection in the database is filled with documents with the schema described above.
     */
    await generateTraitCounts(wassiesQuery, "wassies", true);
    await generateTraitCounts(outcastsQuery, "outcasts", true);
    await generateTraitCounts(couchesQuery, "couches", true);

    /**
     * Create a new list of NFTs that include the trait counts (both raw and binned, if applicable)
     *
     * Trait documents from the generateTraitCounts function are merged with each nft record. Each individual NFT has its trait value (e.g. Eyes: "Eyelashes") replaced with a document from the traits collection.
     * Example Doc:
     * {
     *
     * }
     */
    // await generateRarityDocs(outcastCollection, "outcasts", true);
    // await generateRarityDocs(wassiesCollection, "wassies", true);
    // await generateRarityDocs(couchesCollection, "couches", true);
    // await generateRarityDocs(looksrareCollection, "looksrare", true);

    client.close();
  });
})();
