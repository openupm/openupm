const express = require("express");
const router = express.Router();
var semver = require("semver");

const { Release } = require("../models/release");

router.get("/:name", async function(req, res) {
  let records = await Release.fetchAll({ packageName: req.params.name }, [
    "version",
    "commit",
    "tag",
    "state",
    "buildId",
    "reason",
    "updatedAt"
  ]);
  records.sort(function(a, b) {
    return semver.rcompare(a["version"], b["version"]);
  });
  res.json({ releases: records });
});

module.exports = router;
