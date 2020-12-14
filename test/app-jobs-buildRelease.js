/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");

const buildReleaseModule = rewire("../app/jobs/buildRelease");
const { ReleaseReason } = require("../app/common/constant");
const getReasonFromPublishLog = buildReleaseModule.__get__(
  "getReasonFromPublishLog"
);

describe("app/jobs/buildRelease.js", function() {
  describe("getReasonFromPublishLog()", function() {
    it("None", function() {
      getReasonFromPublishLog("").should.equal(ReleaseReason.None);
    });
    it("BadRequest", function() {
      getReasonFromPublishLog("error code E400").should.equal(
        ReleaseReason.BadRequest
      );
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
    it("GatewayTimeout", function() {
      getReasonFromPublishLog("error code E504").should.equal(
        ReleaseReason.GatewayTimeout
      );
    });
    it("PackageNotFound", function() {
      getReasonFromPublishLog("ENOENT error path package.json").should.equal(
        ReleaseReason.PackageNotFound
      );
    });
    it("PackageNameInvalid", function() {
      getReasonFromPublishLog(
        "error code E400\nerror 400 Bad Request - PUT https://package.***.com/@umm%2fcanvas_resizer - unsupported registry call"
      ).should.equal(ReleaseReason.PackageNameInvalid);
    });
    it("PackageJsonParsingError", function() {
      getReasonFromPublishLog("error code EJSONPARSE").should.equal(
        ReleaseReason.PackageJsonParsingError
      );
    });
    it("PackageJsonParsingError", function() {
      getReasonFromPublishLog("code ERR_STRING_TOO_LONG").should.equal(
        ReleaseReason.HeapOutOfMemroy
      );
      getReasonFromPublishLog("JavaScript heap out of memory").should.equal(
        ReleaseReason.HeapOutOfMemroy
      );
    });
  });
});
