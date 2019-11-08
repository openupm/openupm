/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const redis = require("../app/db/redis");

describe("app/db/redis.js", function() {
  after(function(done) {
    redis.close();
    done();
  });
  describe("hash", function() {
    it("simple", async function() {
      // hset
      await redis.client.hset("example-key", "field-a", "1");
      // hget
      let val = await redis.client.hget("example-key", "field-a");
      val.should.equal("1");
      // hkeys
      let keys = await redis.client.hkeys("example-key");
      keys.should.deepEqual(["field-a"]);
      // hgetall
      let results = await redis.client.hgetall("example-key");
      results.should.deepEqual({ "field-a": "1" });
      // hdel
      await redis.client.hdel("example-key", "field-a");
      // hget null
      val = await redis.client.hget("example-key", "field-a");
      (val === null).should.be.true();
    });
  });
});
