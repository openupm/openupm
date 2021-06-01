/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");

const semverCompare = require("semver-compare");

describe("semverCompare", function() {
  describe("semverCompare", function() {
    it("should equal 1.0.0", function() {
      semverCompare("1.0.0", "1.0.0").should.be.equal(0);
      semverCompare("1.0.0-preview", "1.0.0-preview").should.be.equal(0);
      semverCompare("1.0.0-preview.1", "1.0.0-preview.1").should.be.equal(0);
    });
    it("should equal 1.0.0-preview", function() {
      semverCompare("1.0.0-preview", "1.0.0-preview").should.be.equal(0);
    });
    it("should equal 1.0.0-preview.1", function() {
      semverCompare("1.0.0-preview.1", "1.0.0-preview.1").should.be.equal(0);
    });
    it("1.0.1 > 1.0.0", function() {
      semverCompare("1.0.1", "1.0.0").should.be.equal(1);
    });
    it("1.0.0 > 1.0.0-preview", function() {
      semverCompare("1.0.0", "1.0.0-preview").should.be.equal(1);
    });
    it("1.0.0 > 1.0.0-preview.1", function() {
      semverCompare("1.0.0", "1.0.0-preview.1").should.be.equal(1);
    });
    // it("1.0.0-preview.2 > 1.0.0-preview.1", function() {
    //   semverCompare("1.0.0-preview.2", "1.0.0-preview.1").should.be.equal(1);
    // });
  });
});
