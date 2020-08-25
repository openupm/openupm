const express = require("express");
const SiteInfo = require("../models/siteInfo");

const router = express.Router();

/**
 * Return site info
 */
router.get("/info", async function(req, res) {
  const stars = await SiteInfo.getStars();
  const result = {
    stars
  };
  res.json(result);
});

module.exports = router;
