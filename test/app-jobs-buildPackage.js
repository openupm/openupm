/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");

const buildPackageModule = rewire("../app/jobs/buildPackage");

const filterRemoteTags = buildPackageModule.__get__("filterRemoteTags");
const getInvalidTags = buildPackageModule.__get__("getInvalidTags");

describe("app/jobs/buildPackage.js", function() {
  describe("filterRemoteTags()", function() {
    it("simple", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "1.0.2", commit: "0000010" },
          { tag: "patch", commit: "0000009" },
          { tag: "1.0.0", commit: "0000008" },
          { tag: "0.8.0-preview", commit: "0000006" },
          { tag: "releases/0.8.1-preview", commit: "0000005" }
        ]
      });
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "1.0.2"
        },
        {
          commit: "0000008",
          tag: "1.0.0"
        },
        {
          commit: "0000006",
          tag: "0.8.0-preview"
        },
        {
          commit: "0000005",
          tag: "releases/0.8.1-preview"
        }
      ]);
    });
    it("duplication 1", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "1.0.2", commit: "0000010" },
          { tag: "v1.0.2", commit: "0000009" }
        ]
      });
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "1.0.2"
        }
      ]);
    });
    it("duplication 2", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "v1.0.2", commit: "0000010" },
          { tag: "1.0.2", commit: "0000009" }
        ]
      });
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "v1.0.2"
        }
      ]);
    });
    it("duplication with 'upm/' prefix", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "upm/1.0.2", commit: "0000010" },
          { tag: "1.0.2", commit: "0000009" },
          { tag: "1.0.2-master", commit: "0000008" }
        ]
      });
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "upm/1.0.2"
        }
      ]);
    });
    it("duplication with '-upm' suffix", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "1.0.2-upm", commit: "0000010" },
          { tag: "1.0.2", commit: "0000009" },
          { tag: "1.0.2-master", commit: "0000008" }
        ]
      });
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "1.0.2-upm"
        }
      ]);
    });
    it("duplication with '_upm' suffix", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "1.0.2_upm", commit: "0000010" },
          { tag: "1.0.2", commit: "0000009" },
          { tag: "1.0.2-master", commit: "0000008" }
        ]
      });
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "1.0.2_upm"
        }
      ]);
    });
    it("ignore pattern 1", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "1.0.2-master", commit: "10" },
          { tag: "1.0.2", commit: "09" },
          { tag: "1.0.1-master", commit: "08" },
          { tag: "1.0.1", commit: "07" }
        ],
        gitTagIgnore: "-master$"
      });
      names.should.deepEqual([
        { tag: "1.0.2", commit: "09" },
        { tag: "1.0.1", commit: "07" }
      ]);
    });
    it("ignore pattern 2", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "13.0.0", commit: "10" },
          { tag: "12.0.2", commit: "09" },
          { tag: "1.0.1", commit: "07" }
        ],
        gitTagIgnore: "^(1[0-2]|[0-9])\\..*\\..*"
      });
      names.should.deepEqual([{ tag: "13.0.0", commit: "10" }]);
    });
    it("prefix", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "namespace.core/1.0.0", commit: "10" },
          { tag: "namespace.module.a/1.0.0", commit: "10" },
          { tag: "namespace.module.b/1.0.0", commit: "10" }
        ],
        gitTagPrefix: "namespace.module.a"
      });
      names.should.deepEqual([
        { tag: "namespace.module.a/1.0.0", commit: "10" }
      ]);
    });
    it("prefix and ignore pattern", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "namespace.core/1.0.0", commit: "10" },
          { tag: "namespace.core/2.0.0", commit: "11" },
          { tag: "namespace.module.a/1.0.0", commit: "10" },
          { tag: "namespace.module.a/2.0.0", commit: "11" },
          { tag: "namespace.module.b/1.0.0", commit: "10" },
          { tag: "namespace.module.b/2.0.0", commit: "11" }
        ],
        gitTagPrefix: "namespace.module.a",
        gitTagIgnore: "^namespace\\.module\\.a/([0-1])\\..*\\..*"
      });
      names.should.deepEqual([
        { tag: "namespace.module.a/2.0.0", commit: "11" }
      ]);
    });
    it("minVersion", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "v1.0.2", commit: "010" },
          { tag: "v1.0.0", commit: "008" }
        ],
        minVersion: "1.0.2"
      });
      names.should.deepEqual([
        {
          tag: "v1.0.2",
          commit: "010"
        }
      ]);
    });
    it("minVersion and prefix", function() {
      let names = filterRemoteTags({
        remoteTags: [
          { tag: "namespace.core/1.0.1", commit: "0004" },
          { tag: "1.0.0-preview.1", commit: "0002" }
        ],
        minVersion: "1.0.1"
      });
      names.should.deepEqual([{ tag: "namespace.core/1.0.1", commit: "0004" }]);
    });
  });
  describe("getInvalidTags()", function() {
    it("simple", function() {
      let names = getInvalidTags({
        remoteTags: [
          { tag: "1.0.0", commit: "0000001" },
          { tag: "1.0.2", commit: "0000003" },
          { tag: "releases/2.0.0.1", commit: "0000002" },
          { tag: "releases/1.0.0", commit: "0000002" },
          { tag: "releases/1.0.2", commit: "0000004" },
          { tag: "releases/1.0.3-preview", commit: "0000005" }
        ],
        validTags: [
          { tag: "releases/1.0.0", commit: "0000002" },
          { tag: "releases/1.0.2", commit: "0000004" }
        ],
        gitTagPrefix: "releases",
        gitTagIgnore: "-preview$"
      });
      names.should.deepEqual([{ tag: "releases/2.0.0.1", commit: "0000002" }]);
    });
    it("minVersion", function() {
      let names = getInvalidTags({
        remoteTags: [
          { tag: "1.0.0", commit: "0000001" },
          { tag: "1.0.2", commit: "0000003" }
        ],
        validTags: [{ tag: "1.0.2", commit: "0000003" }],
        minVersion: "1.0.2"
      });
      names.should.deepEqual([]);
    });
  });
});
