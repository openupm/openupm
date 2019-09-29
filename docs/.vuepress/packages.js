// Packages
const fs = require("fs");
const parseGitHubUrl = require("parse-github-url");
const path = require("path");
const spdx = require("spdx-license-list");
const yaml = require("js-yaml");

const packagesDir = path.resolve(__dirname, "../../packages");

module.exports = {
  async additionalPages() {
    return (
      fs
        .readdirSync(packagesDir)
        // Find paths with *.ya?ml ext.
        .filter(p => (p.match(/.*\.(ya?ml)$/) || [])[1] !== undefined)
        // Convert to page info.
        .map(function(p) {
          try {
            const absPath = path.resolve(packagesDir, p);
            // Load package yaml.
            const doc = yaml.safeLoad(fs.readFileSync(absPath, "utf8"));
            const ghUrl = parseGitHubUrl(doc.repoUrl);
            doc.repo = ghUrl.repo;
            doc.owner = ghUrl.owner;
            doc.ownerUrl = "https://" + ghUrl.hostname + "/" + ghUrl.owner;
            if (doc.hunter) {
              doc.hunterUrl = "https://" + ghUrl.hostname + "/" + doc.hunter;
            } else {
              doc.hunter = "anonymous";
              doc.hunterUrl = null;
            }
            if (doc.licenseSpdxId) {
              doc.licenseName = spdx[doc.licenseSpdxId]["name"];
            }
            // Frontmatter.
            const frontmatter = {
              layout: "PackageDetail",
              package: doc
            };
            // Page info.
            const pageUrl = "/packages/" + p.match(/(.*)\.(ya?ml)$/)[1];
            const pageContent =
              "---\n" + yaml.safeDump(frontmatter) + "\n---\n";
            return { path: pageUrl, content: pageContent };
          } catch (e) {
            console.error(e);
            return null;
          }
        })
        // Filter out empty entry.
        .filter(p => p)
    );
  }
};
