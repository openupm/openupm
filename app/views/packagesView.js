const express = require("express");
const router = express.Router();
var semver = require("semver");
const { pick } = require("lodash");

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

router.get("/:name", async function(req, res) {
  let packageName = req.params.name;
  let releases = await Release.fetchAll(packageName);
  releases = releases.map(x => pick(x, releaseFields));
  releases.sort((a, b) => semver.rcompare(a["version"], b["version"]));
  let invalidTags = await PackageExtra.getInvalidTags(packageName);
  invalidTags = invalidTags.map(x => x.tag);
  let data = { releases, invalidTags };
  res.json(data);
});

module.exports = router;
