const express = require("express");
const redis = require("../db/redis");
const router = express.Router();

router.get("/custom", async function(req, res) {
  let obj = await redis.client.hgetall("ad:custom");
  if (!obj) obj = {};
  obj.active = new Boolean(obj.active);
  res.json(obj);
});

module.exports = router;
