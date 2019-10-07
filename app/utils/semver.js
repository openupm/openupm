// Semver util.

const semver = require("semver");

// Semver regular expression.
const semverRe = /^(v?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;

// Get version from git tag name
const getVersionFromTag = function(tag) {
  return semver.clean(tag, { loose: true });
};

module.exports = {
  semverRe,
  getVersionFromTag
};
