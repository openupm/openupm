const express = require("express");
const asyncHandler = require('express-async-handler')
const redis = require("../db/redis");
const router = express.Router();

router.get("/custom", asyncHandler(async function (req, res) {
  let obj = await redis.client.hgetall("ad:custom");
  obj.active = obj.active !== "0";
  res.json(obj);
}));

module.exports = router;
