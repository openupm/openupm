/* Store site info to Redis.
 *
 *   site:info
 *     stars: int
 */

const redis = require("../db/redis");

const siteInfoKey = "site:info";
const propKeys = {
  stars: "stars"
};

const setStars = async function(stars) {
  await setValue(propKeys.stars, stars);
};

const getStars = async function() {
  const text = await getValue(propKeys.stars);
  return parseInt(text);
};

const setValue = async function(propKey, propVal) {
  await redis.client.hset(siteInfoKey, propKey, propVal);
};

const getValue = async function(propKey) {
  return await redis.client.hget(siteInfoKey, propKey);
};

module.exports = {
  getStars,
  setStars
};
