const express = require("express");
const asyncHandler = require('express-async-handler')
const SiteInfo = require("../models/siteInfo");

const router = express.Router();

/**
 * Return site info
 */
router.get("/info", asyncHandler(async function (req, res) {
  const stars = await SiteInfo.getStars();
  const result = {
    stars
  };
  res.json(result);
}));

module.exports = router;
