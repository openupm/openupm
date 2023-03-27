/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const redis = require("../app/db/redis");

const PackageExtra = require("../app/models/packageExtra");

describe("app/models/packageExtra.js", function() {
  afterEach(async function() {
    await redis.client.del("pkg:sample-package");
  });
  after(function(done) {
    redis.close();
    done();
  });
  describe("invalidTags", function() {
    it("empty", async function() {
      let val = await PackageExtra.getInvalidTags("package-not-existed");
      val.should.deepEqual([]);
    });
    it("set and get", async function() {
      await PackageExtra.setInvalidTags("sample-package", ["1.0", "2.0"]);
      let tags = await PackageExtra.getInvalidTags("sample-package");
      tags.should.deepEqual(["1.0", "2.0"]);
    });
  });
  describe("getPropKeyForLang", function() {
    it("zh-CN", function() {
      let val = PackageExtra.getPropKeyForLang("name", "zh-CN");
      val.should.equal("name_zhCN");
    });
    it("en-US", function() {
      let val = PackageExtra.getPropKeyForLang("name", "en-US");
      val.should.equal("name");
    });
    it("undefined", function() {
      let val = PackageExtra.getPropKeyForLang("name");
      val.should.equal("name");
    });
    it("null", function() {
      let val = PackageExtra.getPropKeyForLang("name", null);
      val.should.equal("name");
    });
    it("empty string", function() {
      let val = PackageExtra.getPropKeyForLang("name", "");
      val.should.equal("name");
    });
    it("unsupported lang", function () {
      (function() {
        PackageExtra.getPropKeyForLang("name", "unsupported-lang");
      }).should.throw("Not implemented yet");
    });
  });
});
