const specialsQuery = {
  Background: { $in: ["White", "Grey", "Friendship"] },
};

const couchesQuery = { "Couch Colour": { $ne: null } };

const outcastsQuery = { "Body Colour": "Outcast" };

const wassiesQuery = {
  _id: { $ne: 0 },
  "Couch Colour": null,
  "Body Colour": { $ne: "Outcast" },
};

module.exports = {
  specialsQuery,
  couchesQuery,
  outcastsQuery,
  wassiesQuery,
};
