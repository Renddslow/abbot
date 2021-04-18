const fauna = require('faunadb');

const q = fauna.query;
const client = new fauna.Client({ secret: process.env.FAUNA_KEY });

const getRelationship = async (parent, args) => {
  const relationship = await client.query(q.Get(q.Match(q.Index('relationshipID'), args.id)));

  console.log(relationship);

  return relationship.data;
};

module.exports = getRelationship;
