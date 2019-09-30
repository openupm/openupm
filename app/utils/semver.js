// Semver util.

// Semver regular expression.
const semverRe = /^(v?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;

// Get version from git tag name
const getVersionFromTag = function(tag) {
  if (tag.startsWith("v")) return tag.substr(1);
  else if (tag.startsWith("rc-")) return tag.substr(3);
  else if (tag.startsWith("rc")) return tag.substr(2);
  else return tag;
};

module.exports = {
  semverRe,
  getVersionFromTag
};
