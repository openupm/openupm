/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const redis = require("../app/db/redis");

const { ReleaseReason } = require("../app/common/constant");
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
      reason: 0,
    });
    await Release.save({
      packageName: "sample-package",
      version: "1.0.2",
      state: 0,
      reason: ReleaseReason.LfsBudgetExceeded.value,
    });
    await Release.save({
      packageName: "sample-package",
      version: "1.0.10",
      state: 2,
      reason: 0,
    });
    await Release.save({
      packageName: "sample-package",
      version: "1.0.1",
      state: 3,
      reason: ReleaseReason.BadGateway.value,
    });
    await Release.save({
      packageName: "other-package",
      version: "2.0.0",
      state: 3,
      reason: ReleaseReason.LfsBudgetExceeded.value,
    });
    await Release.save({
      packageName: "other-package",
      version: "2.0.1",
      state: 1,
      reason: 0,
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
      parseFilterArgs(["sample-package", "state=0"]).should.deepEqual({
        packageName: "sample-package",
        stateFilter: { value: 0 },
        reasonFilter: null,
      });
    });

    it("rejects unsupported state", function() {
      (() => parseFilterArgs(["state=99"])).should.throw();
    });

    it("rejects state inequality", function() {
      (() => parseFilterArgs(["state!=0"])).should.throw();
    });

    it("accepts package names starting with state", function() {
      parseFilterArgs(["state-machine"]).should.deepEqual({
        packageName: "state-machine",
        stateFilter: null,
        reasonFilter: null,
      });
    });

    it("accepts package names starting with reason", function() {
      parseFilterArgs(["reasoner.core", "state=0"]).should.deepEqual({
        packageName: "reasoner.core",
        stateFilter: { value: 0 },
        reasonFilter: null,
      });
    });

    it("parses package name, state, and reason filters", function() {
      parseFilterArgs([
        "sample-package",
        "state=3",
        `reason=${ReleaseReason.LfsBudgetExceeded.value}`,
      ]).should.deepEqual({
        packageName: "sample-package",
        stateFilter: { value: 3 },
        reasonFilter: {
          value: ReleaseReason.LfsBudgetExceeded.value,
        },
      });
    });

    it("rejects unsupported reason", function() {
      (() => parseFilterArgs(["reason=999"])).should.throw();
    });

    it("rejects reason inequality", function() {
      (() => parseFilterArgs(["reason!=0"])).should.throw();
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
        stateFilter: { value: 0 },
      });

      releases
        .map(x => `${x.packageName}@${x.version}`)
        .should.deepEqual(["sample-package@1.0.0", "sample-package@1.0.2"]);
    });

    it("filters by package name and state", async function() {
      const releases = await filterReleases({
        packageName: "sample-package",
        stateFilter: { value: 3 },
      });

      releases.map(x => x.version).should.deepEqual(["1.0.1"]);
    });

    it("lists all releases by reason equality", async function() {
      const releases = await filterReleases({
        reasonFilter: {
          value: ReleaseReason.LfsBudgetExceeded.value,
        },
      });

      releases
        .map(x => `${x.packageName}@${x.version}`)
        .should.deepEqual([
          "other-package@2.0.0",
          "sample-package@1.0.2",
        ]);
    });

    it("filters by package name and reason", async function() {
      const releases = await filterReleases({
        packageName: "sample-package",
        reasonFilter: {
          value: ReleaseReason.LfsBudgetExceeded.value,
        },
      });

      releases.map(x => x.version).should.deepEqual(["1.0.2"]);
    });

    it("filters by state and reason", async function() {
      const releases = await filterReleases({
        stateFilter: { value: 0 },
        reasonFilter: {
          value: ReleaseReason.LfsBudgetExceeded.value,
        },
      });

      releases
        .map(x => `${x.packageName}@${x.version}`)
        .should.deepEqual(["sample-package@1.0.2"]);
    });

    it("filters by package name, state, and stale reason", async function() {
      const releases = await filterReleases({
        packageName: "sample-package",
        stateFilter: { value: 0 },
        reasonFilter: {
          value: ReleaseReason.LfsBudgetExceeded.value,
        },
      });

      releases.map(x => x.version).should.deepEqual(["1.0.2"]);
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
