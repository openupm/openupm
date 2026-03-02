/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const redis = require("../app/db/redis");

const Release = require("../app/models/release");
const filterReleaseModule = rewire("../app/jobs/filterRelease");
const parseFilterArgs = filterReleaseModule.__get__("parseFilterArgs");
const fetchAllReleases = filterReleaseModule.__get__("fetchAllReleases");
const filterReleases = filterReleaseModule.__get__("filterReleases");

describe("app/jobs/filterRelease.js", function() {
  beforeEach(async function() {
    await Release.save({
      packageName: "sample-package",
      version: "1.0.0",
      state: 0,
    });
    await Release.save({
      packageName: "sample-package",
      version: "1.0.2",
      state: 0,
    });
    await Release.save({
      packageName: "sample-package",
      version: "1.0.10",
      state: 2,
    });
    await Release.save({
      packageName: "sample-package",
      version: "1.0.1",
      state: 3,
    });
    await Release.save({
      packageName: "other-package",
      version: "2.0.0",
      state: 0,
    });
    await Release.save({
      packageName: "other-package",
      version: "2.0.1",
      state: 1,
    });
  });

  afterEach(async function() {
    await redis.client.del("rel:sample-package");
    await redis.client.del("rel:other-package");
  });

  after(function(done) {
    redis.close();
    done();
  });

  describe("parseFilterArgs()", function() {
    it("parses package name and state filter", function() {
      parseFilterArgs(["sample-package", "state!=0"]).should.deepEqual({
        packageName: "sample-package",
        stateFilter: { operator: "!=", value: 0 },
      });
    });

    it("rejects unsupported state", function() {
      (() => parseFilterArgs(["state=99"])).should.throw();
    });
  });

  describe("filterReleases()", function() {
    it("lists all releases by package name", async function() {
      const releases = await filterReleases({
        packageName: "sample-package",
      });

      releases.map(x => x.version).should.deepEqual([
        "1.0.0",
        "1.0.1",
        "1.0.2",
        "1.0.10",
      ]);
    });

    it("lists all releases by state equality", async function() {
      const releases = await filterReleases({
        stateFilter: { operator: "=", value: 0 },
      });

      releases
        .map(x => `${x.packageName}@${x.version}`)
        .should.deepEqual([
          "other-package@2.0.0",
          "sample-package@1.0.0",
          "sample-package@1.0.2",
        ]);
    });

    it("lists all releases by state inequality", async function() {
      const releases = await filterReleases({
        stateFilter: { operator: "!=", value: 0 },
      });

      releases
        .map(x => `${x.packageName}@${x.version}`)
        .should.deepEqual([
          "other-package@2.0.1",
          "sample-package@1.0.1",
          "sample-package@1.0.10",
        ]);
    });

    it("filters by package name and state", async function() {
      const releases = await filterReleases({
        packageName: "sample-package",
        stateFilter: { operator: "=", value: 3 },
      });

      releases.map(x => x.version).should.deepEqual(["1.0.1"]);
    });
  });

  describe("fetchAllReleases()", function() {
    it("deduplicates keys returned by scan", async function() {
      const restoreRedis = filterReleaseModule.__set__("redis", {
        client: {
          scan: async function(cursor) {
            if (cursor === "0") return ["1", ["rel:sample-package"]];
            return ["0", ["rel:sample-package", "rel:other-package"]];
          },
          hvals: async function(key) {
            if (key === "rel:sample-package") {
              return [
                JSON.stringify({
                  packageName: "sample-package",
                  version: "1.0.0",
                  state: 0,
                }),
              ];
            }
            return [
              JSON.stringify({
                packageName: "other-package",
                version: "2.0.0",
                state: 0,
              }),
            ];
          },
        },
      });

      const releases = await fetchAllReleases();
      restoreRedis();

      releases
        .map(x => `${x.packageName}@${x.version}`)
        .should.deepEqual(["sample-package@1.0.0", "other-package@2.0.0"]);
    });
  });
});
