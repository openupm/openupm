/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");

const buildReleaseModule = rewire("../app/jobs/buildRelease");
const {
  ReleaseReason,
  RetryableReleaseReason,
} = require("../app/common/constant");
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
      getReasonFromBuildLogText("error code E409").should.equal(
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
    it("InvalidVersion", function() {
      getReasonFromBuildLogText("code EBADSEMVER").should.equal(
        ReleaseReason.InvalidVersion
      );
    });
    it("RemoteRepositoryUnavailable", function() {
      getReasonFromBuildLogText(
        "fatal: Could not read from remote repository."
      ).should.equal(ReleaseReason.RemoteRepositoryUnavailable);
    });
    it("RemoteSubmoduleUnavailable", function() {
      getReasonFromBuildLogText(
        "fatal: clone of 'https://github.com/some-submodule-repo' into submodule path"
      ).should.equal(ReleaseReason.RemoteSubmoduleUnavailable);
    });
    it("NpmHookError", function() {
      getReasonFromBuildLogText(`; "publishConfig" from /home/vsts/work/1/s/repo/package.json
registry = "https://package.***.com"
/opt/hostedtoolcache/node/22.22.0/x64/bin/npm publish --tag=patch-3.0.0 --registry=https://package.***.com
sh: 1: markdownlint: not found

npm error code 127
npm error path /home/vsts/work/1/s/repo
> com.wallstop-studios.unity-helpers@3.0.0 prepublishOnly
npm error command failed
npm error command sh -c npm run validate:content`).should.equal(
        ReleaseReason.NpmHookError
      );

      getReasonFromBuildLogText(`; cwd = /home/vsts/work/1/s/repo
/opt/hostedtoolcache/node/22.22.0/x64/bin/npm publish --tag=patch-1.0.51 --registry=https://package.***.com
Error: Cannot find module '/home/vsts/work/1/s/repo/Scripts/sync-versions.js'
> com.indiegabo.hms-unity-sdk@1.0.51 prepare
> node ./Scripts/sync-versions.js
npm error code 1
npm error path /home/vsts/work/1/s/repo
npm error command failed`).should.equal(ReleaseReason.NpmHookError);

      getReasonFromBuildLogText(
        `2026-03-03T08:58:50.3385328Z [command]/opt/hostedtoolcache/node/22.22.0/x64/bin/npm publish --tag=patch-1.0.50 --registry=https://package.***.com
2026-03-03T08:58:50.7023120Z Error: Cannot find module '/home/vsts/work/1/s/repo/Scripts/sync-versions.js'
2026-03-03T08:58:50.7029535Z npm error command failed
2026-03-03T08:58:50.7031936Z > com.indiegabo.hms-unity-sdk@1.0.50 prepare
2026-03-03T08:58:50.7032669Z > node ./Scripts/sync-versions.js`
      ).should.equal(ReleaseReason.NpmHookError);

      RetryableReleaseReason.includes(ReleaseReason.NpmHookError).should.be
        .false();
    });
    it("SubmoduleFetchingError", function() {
      getReasonFromBuildLogText(
        "fatal: Fetched in submodule path 'ext/iOS/sdk', but it did not contain 875b462e73a2619f4a834bf5a009ed760d4789bd.\nDirect fetching of that commit failed."
      ).should.equal(ReleaseReason.SubmoduleFetchingError);
      getReasonFromBuildLogText(
        "fatal: remote error: upload-pack: not our ref 875b462e73a2619f4a834bf5a009ed760d4789bd"
      ).should.not.equal(ReleaseReason.SubmoduleFetchingError);
      RetryableReleaseReason.includes(ReleaseReason.SubmoduleFetchingError)
        .should.be.false();
    });
    it("LfsBudgetExceeded", function() {
      getReasonFromBuildLogText(
        "batch response: This repository exceeded its LFS budget. The account responsible for the budget should increase it to restore access."
      ).should.equal(ReleaseReason.LfsBudgetExceeded);
      RetryableReleaseReason.includes(ReleaseReason.LfsBudgetExceeded).should
        .be.false();
    });
    it("LfsObjectNotFound", function() {
      getReasonFromBuildLogText(
        "Error downloading object: Assets/NuGet/Editor/NugetForUnity.dll (f595479): Smudge error: Error downloading Assets/NuGet/Editor/NugetForUnity.dll (f595479f6c5d0a3b5f6b909f3b8c48d158cace088f0b0f2a091b5234911e8beb): [f595479f6c5d0a3b5f6b909f3b8c48d158cace088f0b0f2a091b5234911e8beb] Object does not exist on the server: [404] Object does not exist on the server"
      ).should.equal(ReleaseReason.LfsObjectNotFound);
      RetryableReleaseReason.includes(ReleaseReason.LfsObjectNotFound).should
        .be.false();
    });
  });
});
