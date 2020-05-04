/* eslint-disable no-undef */
const assert = require("assert");
// eslint-disable-next-line no-unused-vars
const should = require("should");
const rewire = require("rewire");

const {
  cleanRepoUrl,
  loadPackageNames,
  loadPackage,
  loadPackageSync,
  getNamespace
} = rewire("../app/utils/package");

describe("app/util/package.js", function() {
  describe("cleanRepoUrl()", function() {
    it("test https + format https => https", function() {
      assert.equal(
        cleanRepoUrl("https://github.com/username/repo", "https"),
        "https://github.com/username/repo"
      );
    });
    it("test https + format default => https", function() {
      assert.equal(
        cleanRepoUrl("https://github.com/username/repo"),
        "https://github.com/username/repo"
      );
    });
    it("test git + format https => https", function() {
      assert.equal(
        cleanRepoUrl("git@github.com:username/repo", "https"),
        "https://github.com/username/repo"
      );
    });
    it("test git + format git => git", function() {
      assert.equal(
        cleanRepoUrl("git@github.com:username/repo.git", "git"),
        "git@github.com:username/repo.git"
      );
    });
    it("test https + format git => https", function() {
      assert.equal(
        cleanRepoUrl("https://github.com/username/repo.git", "git"),
        "git@github.com:username/repo.git"
      );
    });
  });
  describe("loadPackageNames()", function() {
    it("simple", async function() {
      let names = await loadPackageNames();
      names.should.containEql("com.littlebigfun.addressable-importer");
    });
  });
  describe("loadPackageSync()", function() {
    it("simple", function() {
      let pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      pkg.name.should.equal("com.littlebigfun.addressable-importer");
    });
  });
  describe("loadPackage()", function() {
    it("simple", async function() {
      let pkg = await loadPackage("com.littlebigfun.addressable-importer");
      pkg.name.should.equal("com.littlebigfun.addressable-importer");
      pkg.readme.should.equal("master:README.md");
      pkg.readmeBase.should.equal("master");
    });
    it("simple", async function() {
      let pkg = await loadPackage("com.reese.spawning");
      pkg.readme.should.equal("master:Packages/com.reese.spawning/README.md");
      pkg.readmeBase.should.equal("master/Packages/com.reese.spawning");
    });
  });
  describe("getNamespace()", function() {
    it("x.y", async function() {
      let namespace = getNamespace("com.littlebigfun");
      namespace.should.equal("com.littlebigfun");
    });
    it("x.y.z", async function() {
      let namespace = getNamespace("com.littlebigfun.addressable-importer");
      namespace.should.equal("com.littlebigfun");
    });
    it("x.y.z.sub", async function() {
      let namespace = getNamespace("com.littlebigfun.addressable-importer.sub");
      namespace.should.equal("com.littlebigfun");
    });
  });
});
