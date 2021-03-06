/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");

const buildReleaseModule = rewire("../app/jobs/buildRelease");
const { ReleaseReason } = require("../app/common/constant");
const getReasonFromBuildLogText = buildReleaseModule.__get__(
  "getReasonFromBuildLogText"
);

describe("app/jobs/buildRelease.js", function() {
  describe("getReasonFromBuildLogText()", function() {
    it("None", function() {
      getReasonFromBuildLogText("").should.equal(ReleaseReason.None);
    });
    it("BadRequest", function() {
      getReasonFromBuildLogText("error code E400").should.equal(
        ReleaseReason.BadRequest
      );
    });
    it("Unauthorized", function() {
      getReasonFromBuildLogText("error code E401").should.equal(
        ReleaseReason.Unauthorized
      );
    });
    it("Forbidden", function() {
      getReasonFromBuildLogText("error code E403").should.equal(
        ReleaseReason.Forbidden
      );
    });
    it("VersionConflict", function() {
      getReasonFromBuildLogText("EPUBLISHCONFLICT").should.equal(
        ReleaseReason.VersionConflict
      );
    });
    it("InternalError", function() {
      getReasonFromBuildLogText("error code E500").should.equal(
        ReleaseReason.InternalError
      );
    });
    it("BadGateway", function() {
      getReasonFromBuildLogText("error code E502").should.equal(
        ReleaseReason.BadGateway
      );
    });
    it("ServiceUnavailable", function() {
      getReasonFromBuildLogText("error code E503").should.equal(
        ReleaseReason.ServiceUnavailable
      );
    });
    it("GatewayTimeout", function() {
      getReasonFromBuildLogText("error code E504").should.equal(
        ReleaseReason.GatewayTimeout
      );
    });
    it("PackageNotFound", function() {
      getReasonFromBuildLogText("ENOENT error path package.json").should.equal(
        ReleaseReason.PackageNotFound
      );
    });
    it("PackageNameInvalid", function() {
      getReasonFromBuildLogText(
        "error code E400\nerror 400 Bad Request - PUT https://package.***.com/@umm%2fcanvas_resizer - unsupported registry call"
      ).should.equal(ReleaseReason.PackageNameInvalid);
    });
    it("PackageJsonParsingError", function() {
      getReasonFromBuildLogText("error code EJSONPARSE").should.equal(
        ReleaseReason.PackageJsonParsingError
      );
    });
    it("PackageJsonParsingError", function() {
      getReasonFromBuildLogText("code ERR_STRING_TOO_LONG").should.equal(
        ReleaseReason.HeapOutOfMemroy
      );
      getReasonFromBuildLogText("JavaScript heap out of memory").should.equal(
        ReleaseReason.HeapOutOfMemroy
      );
    });
    it("RemoteBranchNotFound", function() {
      getReasonFromBuildLogText(`Cloning into 'repo'...
warning: Could not find remote branch 4.7.1a to clone.
fatal: Remote branch 4.7.1a not found in upstream origin`).should.equal(
        ReleaseReason.RemoteBranchNotFound
      );
    });
    it("InvalidVersion", function() {
      getReasonFromBuildLogText('error Invalid version: "0.1"').should.equal(
        ReleaseReason.InvalidVersion
      );
    });
    it("RemoteRepositoryUnavailable", function() {
      getReasonFromBuildLogText(
        "fatal: Could not read from remote repository."
      ).should.equal(ReleaseReason.RemoteRepositoryUnavailable);
    });
  });
});
