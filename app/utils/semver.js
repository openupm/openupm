// Semver util.

const semver = require("semver");

// Semver regular expression.
const semverRe = /^(v?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/i;

// Get version from git tag name
const getVersionFromTag = function(tag) {
  // Handle path-like tag: Releases/{version}
  const segs = tag.split("/");
  if (segs.length) tag = segs[segs.length - 1];
  // Handle upm suffix
  const upmRe = /(_|-)(upm|master)$/i;
  tag = tag.replace(upmRe, "");
  // Convert to version
  return semver.clean(tag.toLowerCase(), { loose: true });
};

module.exports = {
  semverRe,
  getVersionFromTag
};
