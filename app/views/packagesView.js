const express = require("express");
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
router.get("/extra", async function(req, res) {
  const data = await PackageExtra.getAggregatedExtraData();
  res.json(data);
});

/**
 * Get package info for given package name.
 */
router.get("/:name", async function(req, res) {
  let packageName = req.params.name;
  // Get releases sorted by semver
  let releases = await Release.fetchAll(packageName);
  releases = releases.map(x => pick(x, releaseFields));
  releases.sort((a, b) => semver.rcompare(a["version"], b["version"]));
  // Get invalid tags
  let invalidTags = await PackageExtra.getInvalidTags(packageName);
  invalidTags = invalidTags.map(x => x.tag);
  // Get readme
  let readme = await PackageExtra.getReadme(packageName);
  // Return as JSON
  let data = { releases, invalidTags, readme };
  res.json(data);
});

module.exports = router;
