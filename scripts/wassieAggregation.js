const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
require("dotenv").config();

const agg = [
  {
    $match: {
      Background: {
        $nin: ["Friendship"],
      },
      "Couch Colour": null,
      "Body Colour": {
        $ne: "Outcast",
      },
    },
  },
  {
    $project: {
      attributes: 0,
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Body",
        trait_value: "$Body",
        wassie_type: "wassies",
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
        trait_type: "Background",
        trait_value: "$Background",
        wassie_type: "wassies",
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
      as: "Background",
    },
  },
  {
    $set: {
      Background: {
        $first: "$Background",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Sigil",
        trait_value: "$Sigil",
        wassie_type: "wassies",
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
      as: "Sigil",
    },
  },
  {
    $set: {
      Sigil: {
        $first: "$Sigil",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Body Colour",
        trait_value: "$Body Colour",
        wassie_type: "wassies",
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
      as: "Body Colour",
    },
  },
  {
    $set: {
      "Body Colour": {
        $first: "$Body Colour",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Belly Colour",
        trait_value: "$Belly Colour",
        wassie_type: "wassies",
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
      as: "Belly Colour",
    },
  },
  {
    $set: {
      "Belly Colour": {
        $first: "$Belly Colour",
      },
    },
  },
  {
    $lookup: {
      from: "loomlocknft_traitmap",
      let: {
        trait_type: "Clothes",
        trait_value: "$Clothes",
        wassie_type: "wassies",
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
        wassie_type: "wassies",
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
        wassie_type: "wassies",
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
        wassie_type: "wassies",
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
        wassie_type: "wassies",
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
        wassie_type: "wassies",
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
          "$Background.score",
          "$Body.score",
          "$Sigil.score",
          "$Clothes.score",
          "$Wieldable.score",
          "$Hat.score",
          "$Beak.score",
          "$Eyes.score",
          "$Feet.score",
          "$Body Colour.score",
          "$Belly Colour.score",
        ],
      },
    },
  },
  {
    $merge: {
      into: "_loomlocknft_intr1_wassies",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert",
    },
  },
];

const agg2 = [
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
      into: "loomlocknft_rankings_wassies",
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
    // Do main aggregation to temporary table
    const deleted1 = await client
      .db("loomlock")
      .collection("_loomlocknft_intr1_wassies")
      .deleteMany({});
    console.log("Deleted1 ", deleted1);
    const coll = client.db("loomlock").collection("loomlocknft_rawdata");
    let res1 = await coll.aggregate(agg).toArray();
    console.log(res1);

    // Do ranking aggregation
    const deleted2 = await client
      .db("loomlock")
      .collection("loomlocknft_rankings_wassies")
      .deleteMany({});
    console.log("Deleted2 ", deleted2);
    const coll2 = client
      .db("loomlock")
      .collection("_loomlocknft_intr1_wassies");
    let res2 = await coll2.aggregate(agg2).toArray();
    console.log(res2);

    client.close();
  }
);
