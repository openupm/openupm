/* Store extra package data to Redis.
 *
 *   pkg:$pkgname
 *     invalidTags: JSON array
 *     stars: int
 *     unity: string
 */

const config = require("config");

const redis = require("../db/redis");
const { getImage } = require("../utils/media");
const { loadPackage } = require("../utils/package");

const allPackagesExtraKey = "pkgs:extra";
const recentPackagesKey = "pkgs:recent";
const packageKey = "pkg:";
const propKeys = {
  imageUrl: "imageUrl",
  invalidTags: "invalidTags",
  ogimageCacheKey: "ogimageCacheKey",
  parentStars: "pstars",
  readme: "readme",
  readmeCacheKey: "readmeCacheKey",
  readmeHtml: "readmeHtml",
  repoPushedTime: "repoPushedTime",
  repoUnavailable: "repoUnavailable",
  repoUpdatedTime: "repoUpdatedTime",
  scopes: "scopes",
  stars: "stars",
  unityVersion: "unity",
  updatedTime: "updatedTime",
  version: "ver",
};

/**
 * Get the property key appended with a language code except en-US.
 * @param {String} propKey - the property key
 * @param {String} lang - the ISO 639-1 standard language code
 * @returns the property key for lang
 */
const getPropKeyForLang = function (propKey, lang) {
  if (!lang || lang == "en-US")
    return propKey;
  else if (lang == "zh-CN")
    return propKey + "_zhCN";
  else
    throw new Error('Not implemented yet');
};

const setInvalidTags = async function (packageName, tags) {
  const jsonText = JSON.stringify(tags, null, 0);
  await setValue(packageName, propKeys.invalidTags, jsonText);
};

const getInvalidTags = async function (packageName) {
  const jsonText = await getValue(packageName, propKeys.invalidTags);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

const setScopes = async function (packageName, scopes) {
  const jsonText = JSON.stringify(scopes, null, 0);
  await setValue(packageName, propKeys.scopes, jsonText);
};

const getScopes = async function (packageName) {
  const jsonText = await getValue(packageName, propKeys.scopes);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

const setVersion = async function (packageName, version) {
  await setValue(packageName, propKeys.version, version);
};

const getVersion = async function (packageName) {
  const text = await getValue(packageName, propKeys.version);
  return text;
};

const setUnityVersion = async function (packageName, unityVersion) {
  await setValue(packageName, propKeys.unityVersion, unityVersion);
};

const getUnityVersion = async function (packageName) {
  const text = await getValue(packageName, propKeys.unityVersion);
  return text;
};

const setStars = async function (packageName, stars) {
  await setValue(packageName, propKeys.stars, stars);
};

const getStars = async function (packageName) {
  const text = await getValue(packageName, propKeys.stars);
  return parseInt(text);
};

const setParentStars = async function (packageName, stars) {
  await setValue(packageName, propKeys.parentStars, stars);
};

const getParentStars = async function (packageName) {
  const text = await getValue(packageName, propKeys.parentStars);
  return parseInt(text);
};

const setReadme = async function (packageName, readme, lang) {
  const key = getPropKeyForLang(propKeys.readme, lang);
  await setValue(packageName, key, readme);
};

const getReadme = async function (packageName, lang) {
  const key = getPropKeyForLang(propKeys.readme, lang);
  const text = await getValue(packageName, key);
  return text;
};

const setReadmeCacheKey = async function (packageName, lang, cacheKey) {
  const key = getPropKeyForLang(propKeys.readmeCacheKey, lang);
  await setValue(packageName, key, cacheKey);
};

const getReadmeCacheKey = async function (packageName, lang) {
  const key = getPropKeyForLang(propKeys.readmeCacheKey, lang);
  const text = await getValue(packageName, key);
  return text;
};

const setReadmeHtml = async function (packageName, readmeHtml, lang) {
  const key = getPropKeyForLang(propKeys.readmeHtml, lang);
  await setValue(packageName, key, readmeHtml);
};

const getReadmeHtml = async function (packageName, lang) {
  const key = getPropKeyForLang(propKeys.readmeHtml, lang);
  const text = await getValue(packageName, key);
  return text;
};

const setImageUrl = async function (packageName, imageUrl) {
  await setValue(packageName, propKeys.imageUrl, imageUrl);
};

const getImageUrl = async function (packageName) {
  const text = await getValue(packageName, propKeys.imageUrl);
  return text;
};

const setOGImageCacheKey = async function (packageName, cacheKey) {
  await setValue(packageName, propKeys.ogimageCacheKey, cacheKey);
};

const getOGImageCacheKey = async function (packageName) {
  const text = await getValue(packageName, propKeys.ogimageCacheKey);
  return text;
};

/**
 * Get image query data for a package, return { imageUrl, width, height, fit }
 * @param {string} packageName
 */
const getImageQueryForPackage = async function (packageName) {
  // get the image url
  const pkg = await loadPackage(packageName);
  let imageUrl = await getImageUrl(packageName);
  if (!imageUrl) {
    imageUrl = pkg.image;
  }
  if (!imageUrl) return null;
  const width = config.packageExtra.image.width;
  const height = config.packageExtra.image.height;
  const fit = pkg.imageFit == "contain" ? "contain" : "cover";
  return { imageUrl, width, height, fit };
};

/**
 * Get image query data for a GitHub user, return { imageUrl, width, height, fit }
 * @param {string} username
 * @param {Number} size
 */
const getImageQueryForGithubUser = async function (username, size) {
  // get the image url
  const imageUrl = `https://github.com/${username}.png?size=${size}`;
  return { imageUrl, width: size, height: size, fit: "cover" };
};

/**
 * Get the cached image filename
 * @param {string} packageName
 */
const getCachedImageFilename = async function (packageName) {
  const imageQuery = await getImageQueryForPackage(packageName);
  if (imageQuery) {
    const imageData = await getImage(imageQuery);
    if (imageData) return imageData.filename;
  }
  return null;
};

const setRepoPushedTime = async function (packageName, value) {
  await setValue(packageName, propKeys.repoPushedTime, value);
};

const getRepoPushedTime = async function (packageName) {
  const value = await getValue(packageName, propKeys.repoPushedTime);
  return parseInt(value) || 0;
};

const setRepoUpdatedTime = async function (packageName, value) {
  await setValue(packageName, propKeys.repoUpdatedTime, value);
};

const getRepoUpdatedTime = async function (packageName) {
  const value = await getValue(packageName, propKeys.repoUpdatedTime);
  return parseInt(value) || 0;
};

const setRepoUnavailable = async function (packageName, value) {
  await setValue(packageName, propKeys.repoUnavailable, value ? "1" : "0");
};

const getRepoUnavailable = async function (packageName) {
  const text = await getValue(packageName, propKeys.repoUnavailable);
  return text == "1" ? true : false;
};

const setUpdatedTime = async function (packageName, updatedTime) {
  await setValue(packageName, propKeys.updatedTime, updatedTime);
};

const getUpdatedTime = async function (packageName) {
  const value = await getValue(packageName, propKeys.updatedTime);
  return parseInt(value) || 0;
};

const setValue = async function (packageName, propKey, propVal) {
  const key = packageKey + packageName;
  await redis.client.hset(key, propKey, propVal);
};

const getValue = async function (packageName, propKey) {
  const key = packageKey + packageName;
  return await redis.client.hget(key, propKey);
};

/**
 * Set aggregated extra data.
 * @param {object} obj
 */
const setAggregatedExtraData = async function (obj) {
  const jsonText = JSON.stringify(obj, null, 0);
  await redis.client.set(allPackagesExtraKey, jsonText);
};

/**
 * Get aggregated extra data.
 */
const getAggregatedExtraData = async function () {
  const jsonText = await redis.client.get(allPackagesExtraKey);
  return jsonText === null ? {} : JSON.parse(jsonText);
};

/**
 * Set recent packages.
 * @param {object} obj
 */
const setRecentPackages = async function (arr) {
  const jsonText = JSON.stringify(arr, null, 0);
  await redis.client.set(recentPackagesKey, jsonText);
};

/**
 * Get recent packages.
 */
const getRecentPackages = async function () {
  const jsonText = await redis.client.get(recentPackagesKey);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

module.exports = {
  getAggregatedExtraData,
  getCachedImageFilename,
  getImageQueryForGithubUser,
  getImageQueryForPackage,
  getImageUrl,
  getInvalidTags,
  getOGImageCacheKey,
  getParentStars,
  getPropKeyForLang,
  getReadme,
  getReadmeCacheKey,
  getReadmeHtml,
  getRecentPackages,
  getRepoPushedTime,
  getRepoUnavailable,
  getRepoUpdatedTime,
  getScopes,
  getStars,
  getUnityVersion,
  getUpdatedTime,
  getVersion,
  propKeys,
  setAggregatedExtraData,
  setImageUrl,
  setInvalidTags,
  setOGImageCacheKey,
  setParentStars,
  setReadme,
  setReadmeCacheKey,
  setReadmeHtml,
  setRecentPackages,
  setRepoPushedTime,
  setRepoUnavailable,
  setRepoUpdatedTime,
  setScopes,
  setStars,
  setUnityVersion,
  setUpdatedTime,
  setVersion,
};
