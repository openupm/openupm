/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const _ = require("lodash");
const redis = require("../app/db/redis");
const {
  loadPackageNames,
  loadPackageSync,
  loadTopics
} = require("../app/utils/package");

describe("data/packages", async function() {
  const packageNames = await loadPackageNames();
  const validTopics = (await loadTopics()).topics;
  console.log(validTopics);
  describe("verify packages", function() {
    for (const packageName of packageNames) {
      it("verify " + packageName, async function() {
        const pkg = await loadPackageSync(packageName);
        // Check required
        should.exist(pkg, "yaml format should be valid");
        should.exist(pkg.repoUrl, "repoUrl is required");
        should.exist(pkg.repoBranch, "repoBranch is required");
        should.exist(pkg.name, "name is required");
        // check topics
        if (pkg.topics) {
          if (_.isString(pkg.topics)) pkg.topics = [pkg.topics];
          for (const topic of pkg.topics) {
            const found = validTopics.find(x => x.slug == topic);
            should.exist(found, `topic ${topic} should be valid`);
          }
        }
      });
    }
  });
});
