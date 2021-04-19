const fauna = require('faunadb');

const q = fauna.query;
const client = new fauna.Client({ secret: process.env.FAUNA_KEY });

const getRelationships = async () => {
  const collections = await client.query(q.Paginate(q.Match(q.Index('archived'), q.Not(true))));
  const data = await Promise.all(collections.data.map((ref) => client.query(q.Get(ref))));
  return data.map((d) => d.data);
};

module.exports = getRelationships;
