const express = require("express");
const router = express.Router();
var semver = require("semver");
const pick = require("lodash").pick;

const Release = require("../models/release");

router.get("/:name", async function(req, res) {
  let objs = await Release.fetchAll(req.params.name);
  objs = objs.map(x =>
    pick(x, [
      "version",
      "commit",
      "tag",
      "state",
      "buildId",
      "reason",
      "updatedAt"
    ])
  );
  objs.sort(function(a, b) {
    return semver.rcompare(a["version"], b["version"]);
  });
  res.json({ releases: objs });
});

module.exports = router;
