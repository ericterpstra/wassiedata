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
      "Couch Colour": { $ne: null },
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
        trait_type: "Rug",
        trait_value: "$Rug",
        wassie_type: "couches",
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
      as: "Rug",
    },
  },
  {
    $set: {
      Rug: {
        $first: "$Rug",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Face",
        trait_value: "$Face",
        wassie_type: "couches",
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
      as: "Face",
    },
  },
  {
    $set: {
      Face: {
        $first: "$Face",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Seat",
        trait_value: "$Seat",
        wassie_type: "couches",
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
      as: "Seat",
    },
  },
  {
    $set: {
      Seat: {
        $first: "$Seat",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Couch Colour",
        trait_value: "$Couch Colour",
        wassie_type: "couches",
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
      as: "Couch Colour",
    },
  },
  {
    $set: {
      "Couch Colour": {
        $first: "$Couch Colour",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Hat",
        trait_value: "$Hat",
        wassie_type: "couches",
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
        trait_type: "Wassie Colour",
        trait_value: "$Wassie Colour",
        wassie_type: "couches",
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
      as: "Wassie Colour",
    },
  },
  {
    $set: {
      "Wassie Colour": {
        $first: "$Wassie Colour",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Right Arm",
        trait_value: "$Right Arm",
        wassie_type: "couches",
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
      as: "Right Arm",
    },
  },
  {
    $set: {
      "Right Arm": {
        $first: "$Right Arm",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Left Arm",
        trait_value: "$Left Arm",
        wassie_type: "couches",
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
      as: "Left Arm",
    },
  },
  {
    $set: {
      "Left Arm": {
        $first: "$Left Arm",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Couch Bottom",
        trait_value: "$Couch Bottom",
        wassie_type: "couches",
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
      as: "Couch Bottom",
    },
  },
  {
    $set: {
      "Couch Bottom": {
        $first: "$Couch Bottom",
      },
    },
  },
  {
    $set: {
      rarity_score: {
        $sum: [
          "$Rug.score",
          "$Couch Colour.score",
          "$Face.score",
          "$Hat.score",
          "$Wassie Colour.score",
          "$Right Arm.score",
          "$Left Arm.score",
          "$Seat.score",
          "$Couch Bottom.score",
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
      into: "loomlocknft_rankings_couches",
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
      .collection("loomlocknft_rankings_couches")
      .deleteMany({});
    console.log("Deleted ", deleted);
    const coll = await client.db("loomlock").collection("loomlocknft_rawdata");
    let result = await coll.aggregate(agg).toArray();
    console.log(result);
    client.close();
  }
);
