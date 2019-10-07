const express = require("express");
const router = express.Router();
var semver = require("semver");

const { Release } = require("../models/release");

router.get("/:name", async function(req, res) {
  let records = await Release.fetchAll({ package_name: req.params.name }, [
    "version",
    "commit",
    "tag",
    "state",
    "build_id",
    "reason"
  ]);
  records.sort(function(a, b) {
    return semver.rcompare(a["version"], b["version"]);
  });
  res.json({ releases: records });
});

module.exports = router;
