/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const redis = require("../app/db/redis");

const Release = require("../app/models/release");
const { ReleaseReason } = require("../app/common/constant");
const { updateRelease } = require("../app/jobs/updateRelease");

describe("app/jobs/updateRelease.js", function() {
  afterEach(async function() {
    await redis.client.del("rel:sample-package");
  });

  after(function(done) {
    redis.close();
    done();
  });

  describe("updateRelease()", function() {
    it("updates state", async function() {
      await Release.save({
        packageName: "sample-package",
        version: "1.0.0",
        state: 1,
      });

      await updateRelease("sample-package", "1.0.0", "state", "0");

      const rel = await Release.fetchOne("sample-package", "1.0.0");
      rel.state.should.equal(0);
    });

    it("rejects unsupported field", async function() {
      await Release.save({
        packageName: "sample-package",
        version: "1.0.0",
        state: 1,
      });

      await updateRelease("sample-package", "1.0.0", "buildId", "0").should.be
        .rejected();
    });

    it("rejects unsupported state value", async function() {
      await Release.save({
        packageName: "sample-package",
        version: "1.0.0",
        state: 1,
      });

      await updateRelease("sample-package", "1.0.0", "state", "99").should.be
        .rejected();
    });

    it("updates reason", async function() {
      await Release.save({
        packageName: "sample-package",
        version: "1.0.0",
        state: 3,
        reason: 0,
      });

      await updateRelease(
        "sample-package",
        "1.0.0",
        "reason",
        `${ReleaseReason.LfsBudgetExceeded.value}`
      );

      const rel = await Release.fetchOne("sample-package", "1.0.0");
      rel.reason.should.equal(ReleaseReason.LfsBudgetExceeded.value);
    });

    it("rejects unsupported reason value", async function() {
      await Release.save({
        packageName: "sample-package",
        version: "1.0.0",
        state: 3,
        reason: 0,
      });

      await updateRelease("sample-package", "1.0.0", "reason", "999").should.be
        .rejected();
    });
  });
});
