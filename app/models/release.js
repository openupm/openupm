/* Release model.
 *
 * Redis structure: rel:$name: hash{ version => JSON }
 * e.g.
 *     rel:com.company.sample-package
 *       1.0.0: JSON_STRING
 *       1.0.1: JSON_STRING
 */

const redis = require("../db/redis");
const { pick } = require("lodash/object");

const releaseKey = "rel:";
const releaseFields = [
  "packageName",
  "version",
  "commit",
  "tag",
  "state",
  "buildId",
  "reason",
  "createdAt",
  "updatedAt"
];

const save = async function(obj) {
  if (!obj.packageName || !obj.version)
    throw new Error(
      `Can not create or update release with packageName=${obj.packageName} version=${obj.version}`
    );
  let now = new Date().getTime();
  let record = await fetchOne(obj.packageName, obj.version);
  if (record === null)
    record = {
      version: "",
      commit: "",
      tag: "",
      state: 0,
      buildId: "",
      reason: 0,
      createdAt: now
    };
  Object.assign(record, pick(obj, releaseFields));
  record.updatedAt = now;
  let jsonText = JSON.stringify(record, null, 0);
  let key = releaseKey + record.packageName;
  await redis.client.hset(key, record.version, jsonText);
  Object.assign(obj, record);
  return obj;
};

const remove = async function({ packageName, version }) {
  if (!packageName || !version)
    throw new Error(
      `Can not remove release with packageName=${packageName} version=${version}`
    );
  let key = releaseKey + packageName;
  await redis.client.hdel(key, version);
};

const fetchOne = async function(packageName, version) {
  let key = releaseKey + packageName;
  let obj = await redis.client.hget(key, version);
  if (obj === null) return null;
  return JSON.parse(obj);
};

const fetchOneOrThrow = async function(packageName, version) {
  let obj = await fetchOne(packageName, version);
  if (obj === null)
    throw new Error(
      `Failed to fetch package name=${packageName} version=${version}}`
    );
  return obj;
};

const fetchAll = async function(packageName) {
  let key = releaseKey + packageName;
  let objs = await redis.client.hgetall(key);
  return Object.values(objs).map(x => JSON.parse(x));
};

module.exports = {
  save,
  remove,
  fetchOne,
  fetchOneOrThrow,
  fetchAll
};
