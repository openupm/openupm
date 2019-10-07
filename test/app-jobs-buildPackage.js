/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");

const buildPackageModule = rewire("../app/jobs/buildPackage");

const filterRemoteTags = buildPackageModule.__get__("filterRemoteTags");

describe("app/jobs/buildPackage.js", function() {
  describe("filterRemoteTags()", function() {
    it("simple", function() {
      let names = filterRemoteTags([
        { tag: "1.0.2", commit: "0000010" },
        { tag: "patch", commit: "0000009" },
        { tag: "1.0.0", commit: "0000008" },
        { tag: "0.8.0-preview", commit: "0000006" }
      ]);
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
        }
      ]);
    });
    it("duplication 1", function() {
      let names = filterRemoteTags([
        { tag: "1.0.2", commit: "0000010" },
        { tag: "v1.0.2", commit: "0000009" }
      ]);
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "1.0.2"
        }
      ]);
    });
    it("duplication 2", function() {
      let names = filterRemoteTags([
        { tag: "v1.0.2", commit: "0000010" },
        { tag: "1.0.2", commit: "0000009" }
      ]);
      names.should.deepEqual([
        {
          commit: "0000010",
          tag: "v1.0.2"
        }
      ]);
    });
  });
});
