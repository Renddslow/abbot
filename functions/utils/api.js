const got = require('got');
const catchify = require('catchify');
const qs = require('qs');

const PCO_ID = process.env.PCO_ID;
const PCO_SECRET = process.env.PCO_SECRET;

module.exports.apiGet = async (resource, route, query = {}) => {
  const baseUrl = `https://api.planningcenteronline.com/${resource}/v2/${route}`;
  const queryString = qs.stringify(query, { encode: false });
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const [err, data] = await catchify(
    got(url, {
      username: PCO_ID,
      password: PCO_SECRET,
    }).json(),
  );

  return [err, data];
};

module.exports.apiPost = async (resource, route, body = {}, query = {}) => {
  const baseUrl = `https://api.planningcenteronline.com/${resource}/v2/${route}`;
  const queryString = qs.stringify(query, { encode: false });
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const [err, data] = await catchify(
    got(url, {
      method: 'POST',
      username: PCO_ID,
      password: PCO_SECRET,
      body: JSON.stringify(body),
    }).json(),
  );

  return [err, data];
};
