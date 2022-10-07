const express = require("express");
const asyncHandler = require('express-async-handler')
const router = express.Router();
const PackageFeed = require("../models/packageFeed");

router.get("/updates/rss", asyncHandler(async function (req, res) {
  const data = await PackageFeed.getFeedRecentUpdate("rss2");
  res.set("Content-Type", "application/rss+xml");
  res.send(data);
}));

router.get("/updates/atom", asyncHandler(async function (req, res) {
  const data = await PackageFeed.getFeedRecentUpdate("atom1");
  res.set("Content-Type", "application/atom+xml");
  res.send(data);
}));

router.get("/updates/json", asyncHandler(async function (req, res) {
  const data = await PackageFeed.getFeedRecentUpdate("json1");
  res.set("Content-Type", "application/json");
  res.send(data);
}));

module.exports = router;
