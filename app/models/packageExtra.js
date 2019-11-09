/* Package extra model.
 *
 * Redis structure: pkg:$name: HASH
 * e.g.
 *     pkg:com.company.sample-package
 *       invalidTags: JSON_STRING
 */

const redis = require("../db/redis");

const packageKey = "pkg:";
const invalidTagsPropKey = "invalidTags";

const setInvalidTags = async function(packageName, tags) {
  let jsonText = JSON.stringify(tags, null, 0);
  await setValue(packageName, invalidTagsPropKey, jsonText);
};

const getInvalidTags = async function(packageName) {
  let jsonText = await getValue(packageName, invalidTagsPropKey);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

const setValue = async function(packageName, propKey, propVal) {
  let key = packageKey + packageName;
  await redis.client.hset(key, propKey, propVal);
};

const getValue = async function(packageName, propKey) {
  let key = packageKey + packageName;
  return await redis.client.hget(key, propKey);
};

module.exports = {
  setInvalidTags,
  getInvalidTags
};
