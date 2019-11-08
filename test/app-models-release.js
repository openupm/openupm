/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const redis = require("../app/db/redis");

const Release = require("../app/models/release");

describe("app/models/release.js", function() {
  afterEach(async function() {
    await redis.client.del("rel:sample-package");
  });
  after(function(done) {
    redis.close();
    done();
  });
  describe("save()", function() {
    it("save empty", async function() {
      Release.save({}).should.be.rejected();
    });
    it("combined", async function() {
      let obj = await Release.save({
        packageName: "sample-package",
        version: "1.0.0"
      });
      obj.packageName.should.equal("sample-package");
      obj.version.should.equal("1.0.0");
      obj.createdAt.should.above(0);
      obj.updatedAt.should.above(0);
      obj.state.should.equal(0);
      obj.reason.should.equal(0);
      obj.buildId.should.equal("");
      await Release.save({
        packageName: obj.packageName,
        version: obj.version,
        buildId: "123"
      });
      let obj2 = await Release.fetchOne(obj.packageName, obj.version);
      obj2.buildId.should.equal("123");
      await Release.remove(obj2);
      let obj3 = await Release.fetchOne(obj.packageName, obj.version);
      (obj3 === null).should.be.true();
    });
  });
  describe("fetchOneOrThrow()", function() {
    it("simple", async function() {
      Release.fetchOneOrThrow(
        "not-exist-package",
        "1.0.0"
      ).should.be.rejected();
    });
  });

  describe("fetchAll()", function() {
    it("simple", async function() {
      let obj1 = await Release.save({
        packageName: "sample-package",
        version: "1.0.0"
      });
      let obj2 = await Release.save({
        packageName: "sample-package",
        version: "1.0.1"
      });
      let objs = await Release.fetchAll(obj1.packageName);
      objs
        .map(x => x.version)
        .sort()
        .should.deepEqual(["1.0.0", "1.0.1"]);
    });
  });
});
