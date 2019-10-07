/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");

const buildReleaseModule = rewire("../app/jobs/buildRelease");
const { ReleaseReason } = require("../app/models/common");
const getBuildName = buildReleaseModule.__get__("getBuildName");
const getReasonFromPublishLog = buildReleaseModule.__get__(
  "getReasonFromPublishLog"
);

describe("app/jobs/buildRelease.js", function() {
  describe("getBuildName()", function() {
    it("simple", function() {
      getBuildName({
        releaseId: 1,
        packageName: "com.littlebigfun.addressable-importer",
        packageVersion: "0.4.1"
      }).should.equal("rel1-com.littlebigfun.addressable-importer#0.4.1");
    });
    it("unaccepted-character", function() {
      getBuildName({
        releaseId: 1,
        packageName: "/:<>\\|?@*",
        packageVersion: "0.4.1"
      }).should.equal("rel1-_________#0.4.1");
    });
  });
  describe("getReasonFromPublishLog()", function() {
    it("None", function() {
      getReasonFromPublishLog("").should.equal(ReleaseReason.None);
    });
    it("Unauthorized", function() {
      getReasonFromPublishLog("error code E401").should.equal(
        ReleaseReason.Unauthorized
      );
    });
    it("Forbidden", function() {
      getReasonFromPublishLog("error code E403").should.equal(
        ReleaseReason.Forbidden
      );
    });
    it("VersionConflict", function() {
      getReasonFromPublishLog("EPUBLISHCONFLICT").should.equal(
        ReleaseReason.VersionConflict
      );
    });
    it("InternalError", function() {
      getReasonFromPublishLog("error code E500").should.equal(
        ReleaseReason.InternalError
      );
    });
    it("BadGateway", function() {
      getReasonFromPublishLog("error code E502").should.equal(
        ReleaseReason.BadGateway
      );
    });
    it("ServiceUnavailable", function() {
      getReasonFromPublishLog("error code E503").should.equal(
        ReleaseReason.ServiceUnavailable
      );
    });
    it("PackageNotFound", function() {
      getReasonFromPublishLog("ENOENT error path package.json").should.equal(
        ReleaseReason.PackageNotFound
      );
    });
  });
});
