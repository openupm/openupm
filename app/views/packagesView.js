const express = require("express");
const asyncHandler = require('express-async-handler')

const router = express.Router();
var semver = require("semver");
const { pick } = require("lodash/object");

const Release = require("../models/release");
const PackageExtra = require("../models/packageExtra");
const releaseFields = [
  "version",
  "commit",
  "tag",
  "state",
  "buildId",
  "reason",
  "updatedAt"
];

/**
 * Get aggregated package extra data.
 */
router.get("/extra", asyncHandler(async function (req, res) {
  const data = await PackageExtra.getAggregatedExtraData();
  res.json(data);
}));

/**
 * Get recent packages.
 */
router.get("/recent", asyncHandler(async function (req, res) {
  const data = await PackageExtra.getRecentPackages();
  res.json(data);
}));

/**
 * Get package info for given package name.
 */
router.get("/:name", asyncHandler(async function (req, res) {
  const packageName = req.params.name;
  // Get releases sorted by semver
  let releases = await Release.fetchAll(packageName);
  releases = releases.map(x => pick(x, releaseFields));
  releases.sort((a, b) => semver.rcompare(a["version"], b["version"]));
  // Get invalid tags
  let invalidTags = await PackageExtra.getInvalidTags(packageName);
  invalidTags = invalidTags.map(x => x.tag);
  // Get readme
  const readmeHtml = await PackageExtra.getReadmeHtml(packageName);
  const readmeHtml_zhCN = await PackageExtra.getReadmeHtml(
    packageName,
    "zh-CN"
  );
  // Get package scopes
  const scopes = await PackageExtra.getScopes(packageName);
  // Return as JSON
  let data = { releases, invalidTags, readmeHtml, scopes, readmeHtml_zhCN };
  res.json(data);
}));

module.exports = router;
