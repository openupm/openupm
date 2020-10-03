/* eslint-disable no-undef */
const assert = require("assert");

const { getVersionFromTag, semverRe } = require("../app/utils/semver");

describe("app/utils/semver.js", function() {
  describe("getVersionFromTag()", function() {
    it("test a.b.c", function() {
      assert.equal(getVersionFromTag("v1.0.0"), "1.0.0");
    });
    it("test va.b.c", function() {
      assert.equal(getVersionFromTag("v1.0.0"), "1.0.0");
    });
    it("test Va.b.c", function() {
      assert.equal(getVersionFromTag("V1.0.0"), "1.0.0");
    });
    it("test a.b.c-preview", function() {
      assert.equal(getVersionFromTag("1.0.0-preview"), "1.0.0-preview");
    });
    it("test va.b.c-preview", function() {
      assert.equal(getVersionFromTag("v1.0.0-preview"), "1.0.0-preview");
    });
    it("test a.b.c.d", function() {
      assert.equal(getVersionFromTag("1.0.0.0"), null);
    });
    it("test va.b.c.d", function() {
      assert.equal(getVersionFromTag("v1.0.0.0"), null);
    });
    it("test a.b.c-preview.d", function() {
      assert.equal(getVersionFromTag("1.0.0-preview.0"), "1.0.0-preview.0");
    });
    it("test va.b.c-preview.d", function() {
      assert.equal(getVersionFromTag("v1.0.0-preview.0"), "1.0.0-preview.0");
    });
    it("test releases/va.b.c-preview.d", function() {
      assert.equal(
        getVersionFromTag("releases/v1.0.0-preview.0"),
        "1.0.0-preview.0"
      );
    });
    it("test releases-va.b.c-preview.d", function() {
      assert.equal(
        getVersionFromTag("releases-v1.0.0-preview.0"),
        "1.0.0-preview.0"
      );
    });
    it("test releases_va.b.c-preview.d", function() {
      assert.equal(
        getVersionFromTag("releases_v1.0.0-preview.0"),
        "1.0.0-preview.0"
      );
    });
    it("test va.b.c-upm", function() {
      assert.equal(getVersionFromTag("v1.0.0-upm"), "1.0.0");
    });
    it("test va.b.c_upm", function() {
      assert.equal(getVersionFromTag("v1.0.0_upm"), "1.0.0");
    });
  });
  describe("semverRe", function() {
    it("test a.b.c", function() {
      semverRe.test("1.0.0").should.be.ok();
    });
    it("test va.b.c", function() {
      semverRe.test("v1.0.0").should.be.ok();
    });
    it("test Va.b.c", function() {
      semverRe.test("V1.0.0").should.be.ok();
    });
  });
});
