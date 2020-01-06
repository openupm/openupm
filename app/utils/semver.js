// Semver util.

const semver = require("semver");

// Semver regular expression.
const semverRe = /^(v?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/i;

// Get version from git tag name
const getVersionFromTag = function(tag) {
  return semver.clean(tag.toLowerCase(), { loose: true });
};

module.exports = {
  semverRe,
  getVersionFromTag
};
