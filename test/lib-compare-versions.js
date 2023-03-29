/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");

const { compareVersions }  = require("compare-versions");

describe("compareVersions", function() {
  describe("compareVersions", function() {
    it("should equal 1.0.0", function() {
      compareVersions("1.0.0", "1.0.0").should.be.equal(0);
      compareVersions("1.0.0-preview", "1.0.0-preview").should.be.equal(0);
      compareVersions("1.0.0-preview.1", "1.0.0-preview.1").should.be.equal(0);
    });
    it("should equal 1.0.0-preview", function() {
      compareVersions("1.0.0-preview", "1.0.0-preview").should.be.equal(0);
    });
    it("should equal 1.0.0-preview.1", function() {
      compareVersions("1.0.0-preview.1", "1.0.0-preview.1").should.be.equal(0);
    });
    it("1.0.1 > 1.0.0", function() {
      compareVersions("1.0.1", "1.0.0").should.be.equal(1);
    });
    it("1.0.0 > 1.0.0-preview", function() {
      compareVersions("1.0.0", "1.0.0-preview").should.be.equal(1);
    });
    it("1.0.0 > 1.0.0-preview.1", function() {
      compareVersions("1.0.0", "1.0.0-preview.1").should.be.equal(1);
    });
    it("1.0.1-preview.1 > 1.0.0", function() {
      compareVersions("1.0.1-preview.1", "1.0.0").should.be.equal(1);
    });
    it("1.0.0-preview.2 > 1.0.0-preview.1", function() {
      compareVersions("1.0.0-preview.2", "1.0.0-preview.1").should.be.equal(1);
    });
  });
});
