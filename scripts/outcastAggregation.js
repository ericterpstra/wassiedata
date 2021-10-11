const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
require("dotenv").config();

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      "Body Colour": "Outcast",
    },
  },
  {
    $project: {
      attributes: 0,
      Sigil: 0,
      Background: 0,
      "Body Colour": 0,
      "Belly Colour": 0,
      Beak: 0,
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Body",
        trait_value: "$Body",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
            score: 1,
          },
        },
      ],
      as: "Body",
    },
  },
  {
    $set: {
      Body: {
        $first: "$Body",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Clothes",
        trait_value: "$Clothes",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
            score: 1,
          },
        },
      ],
      as: "Clothes",
    },
  },
  {
    $set: {
      Clothes: {
        $first: "$Clothes",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Beak",
        trait_value: "$Beak",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
          },
        },
      ],
      as: "Beak",
    },
  },
  {
    $set: {
      Beak: {
        $first: "$Beak",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Wieldable",
        trait_value: "$Wieldable",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
            score: 1,
          },
        },
      ],
      as: "Wieldable",
    },
  },
  {
    $set: {
      Wieldable: {
        $first: "$Wieldable",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Hat",
        trait_value: "$Hat",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
            score: 1,
          },
        },
      ],
      as: "Hat",
    },
  },
  {
    $set: {
      Hat: {
        $first: "$Hat",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Eyes",
        trait_value: "$Eyes",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
            score: 1,
          },
        },
      ],
      as: "Eyes",
    },
  },
  {
    $set: {
      Eyes: {
        $first: "$Eyes",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Feet",
        trait_value: "$Feet",
        wassie_type: "outcasts",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$wassie_type", "$$wassie_type"],
                },
                {
                  $eq: ["$trait_type", "$$trait_type"],
                },
                {
                  $eq: ["$value", "$$trait_value"],
                },
              ],
            },
          },
        },
        {
          $project: {
            value: 1,
            count: 1,
            pct: 1,
            bin: 1,
            binPct: 1,
            score: 1,
          },
        },
      ],
      as: "Feet",
    },
  },
  {
    $set: {
      Feet: {
        $first: "$Feet",
      },
    },
  },
  {
    $set: {
      rarity_score: {
        $sum: [
          "$Body.score",
          "$Clothes.score",
          "$Wieldable.score",
          "$Hat.score",
          "$Beak.score",
          "$Eyes.score",
          "$Feet.score",
        ],
      },
    },
  },
  {
    $setWindowFields: {
      sortBy: {
        rarity_score: -1,
      },
      output: {
        rarity_rank: {
          $rank: {},
        },
      },
    },
  },
  {
    $merge: {
      into: "loomlocknft_rankings_outcasts",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert",
    },
  },
];

MongoClient.connect(
  process.env.MONGO_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr);
    const deleted = await client
      .db("loomlock")
      .collection("loomlocknft_rankings_outcasts")
      .deleteMany({});
    const coll = await client.db("loomlock").collection("loomlocknft_rawdata");
    let result = await coll.aggregate(agg).toArray();
    console.log(result);
    client.close();
  }
);
