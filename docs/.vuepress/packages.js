// Packages
const parseGitHubUrl = require("parse-github-url");
const spdx = require("spdx-license-list");
const yaml = require("js-yaml");
const {
  loadPackageSync,
  loadPackageNames
} = require("../../app/utils/package");

module.exports = {
  async additionalPages() {
    let packageNames = await loadPackageNames();
    return (
      packageNames
        .map(function(packageName) {
          try {
            let doc = loadPackageSync(packageName);
            let ghUrl = parseGitHubUrl(doc.repoUrl);
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
            let title = doc.displayName
              ? `${doc.displayName} ${doc.name}`
              : doc.name;
            const frontmatter = {
              layout: "PackageDetail",
              title,
              package: doc
            };
            // Page info.
            const pageUrl = "/packages/" + packageName + ".html";
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
