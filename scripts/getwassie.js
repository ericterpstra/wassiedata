require("dotenv").config();
const axios = require("axios");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const baseURL =
  "https://fruuydfac2a4b4v5rip3ovqv5gg2sbaqgcgwnbnztlbt7xed7ela.arweave.net/LGlMDKAWgcDyvYoft1YV6Y2pBBAwjWaFuZrDP9yD-RY/";

async function fetchWassie(num) {
  let fullUrl = baseURL + num + ".json";
  let { data } = await axios.get(fullUrl);
  data._id = num;
  return data;
}

(async () => {
  let num = 0;
  client.connect(async (err) => {
    const wassieCollection = client.db("wassies").collection("loomlocknfts");

    while (num < 12345) {
      let wassieData = await fetchWassie(num);

      // Denormalize 'attributes' into field level data for each record
      let wassie = wassieData.attributes.reduce((wassie, attr, i) => {
        wassie[attr.trait_type] = attr.value;
        return wassie;
      }, wassieData);

      console.log(num);

      // write record to database
      await wassieCollection.insertOne(wassie);

      num++;
    }
    console.log("done");
    client.close();
  });
})();
