/* Package extra model.
 *
 * Redis structure: pkg:$name: HASH
 * e.g.
 *     pkg:com.company.sample-package
 *       invalidTags: JSON_STRING
 */

const redis = require("../db/redis");

const allPackagesExtraKey = "pkgs:extra";
const packageKey = "pkg:";
const propKeys = {
  invalidTags: "invalidTags",
  unityVersion: "unity",
  stars: "stars"
};

const setInvalidTags = async function(packageName, tags) {
  const jsonText = JSON.stringify(tags, null, 0);
  await setValue(packageName, propKeys.invalidTags, jsonText);
};

const getInvalidTags = async function(packageName) {
  const jsonText = await getValue(packageName, propKeys.invalidTags);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

const setUnityVersion = async function(packageName, unityVersion) {
  await setValue(packageName, propKeys.unityVersion, unityVersion);
};

const getUnityVersion = async function(packageName) {
  const text = await getValue(packageName, propKeys.unityVersion);
  return text;
};

const setStars = async function(packageName, stars) {
  await setValue(packageName, propKeys.stars, stars);
};

const getStars = async function(packageName) {
  const text = await getValue(packageName, propKeys.stars);
  return parseInt(text);
};

const setValue = async function(packageName, propKey, propVal) {
  const key = packageKey + packageName;
  await redis.client.hset(key, propKey, propVal);
};

const getValue = async function(packageName, propKey) {
  const key = packageKey + packageName;
  return await redis.client.hget(key, propKey);
};

const setAllPackagesExtra = async function(obj) {
  const jsonText = JSON.stringify(obj, null, 0);
  await redis.client.set(allPackagesExtraKey, jsonText);
};

const getAllPackagesExtra = async function() {
  const jsonText = await redis.client.get(allPackagesExtraKey);
  return jsonText === null ? {} : JSON.parse(jsonText);
};

module.exports = {
  setInvalidTags,
  getInvalidTags,
  setUnityVersion,
  getUnityVersion,
  setStars,
  getStars,
  setAllPackagesExtra,
  getAllPackagesExtra
};
