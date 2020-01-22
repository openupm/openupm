// Semver util.

const semver = require("semver");

// Semver regular expression.
const semverRe = /^(v?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/i;

// Get version from git tag name
const getVersionFromTag = function(tag) {
  const segs = tag.split("/");
  if (segs.length) tag = segs[segs.length - 1];
  return semver.clean(tag.toLowerCase(), { loose: true });
};

module.exports = {
  semverRe,
  getVersionFromTag
};
