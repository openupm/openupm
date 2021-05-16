/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const fs = require("fs");
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const { isString } = require("lodash/lang");
const redis = require("../app/db/redis");
const spdx = require("spdx-license-list");
const {
  loadPackageNames,
  loadPackageSync,
  loadTopics,
  loadBlockedScopes,
  packagesDir,
  isValidPackageName
} = require("../app/utils/package");

const knownInvalidNames = [
  "com.litedb"
];

describe("data/packages", async function() {
  const packageNames = await loadPackageNames();
  const validTopics = await loadTopics();
  const blockedScopes = await loadBlockedScopes();
  describe("verify packages", function() {
    for (const packageName of packageNames) {
      it("verify format: " + packageName, async function() {
        const pkg = await loadPackageSync(packageName);
        // Check required
        should.exist(pkg, "yaml format should be valid");
        should.exist(pkg.repoUrl, "repoUrl is required");
        should.exist(pkg.name, "name is required");
        const [isNameValid, nameValidError] = isValidPackageName(pkg.name);
        // Ignore known invalid names
        if (!knownInvalidNames.includes(pkg.name)) {
          if (!isNameValid) throw nameValidError;
        }
        should.equal(
          pkg.name,
          packageName,
          "pkg.name should be match with filename[.yml]"
        );
        // Check blocked scopes
        for (let scope of blockedScopes) {
          should.ok(!pkg.name.startsWith(scope), `scope ${scope} is blocked.`);
        }
        // check topics
        if (pkg.topics) {
          if (isString(pkg.topics)) pkg.topics = [pkg.topics];
          for (const topic of pkg.topics) {
            const found = validTopics.find(x => x.slug == topic);
            should.exist(found, `topic ${topic} should be valid`);
          }
        }
        // check license
        if (pkg.licenseSpdxId) {
          should.exist(
            spdx[pkg.licenseSpdxId],
            `licenseSpdxId ${pkg.licenseSpdxId} should be valid. See full IDs at https://raw.githubusercontent.com/sindresorhus/spdx-license-list/master/spdx-simple.json`
          );
        }
        // check image
        if (pkg.image) {
          should.ok(
            /https?:\/\//i.test(pkg.image),
            `image field should be a valid URL.`
          );
        }
      });
    }
  });
  describe("verify packages extention name", function() {
    const files = fs.readdirSync(packagesDir);
    for (const file of files) {
      it("verify extention name: " + file, function() {
        file.should.endWith(".yml");
      });
    }
  });
});
