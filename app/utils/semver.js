// Semver util.

const semver = require("semver");

// Semver regular expression.
const semverRe = /^(v?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/i;

// Get version from git tag name.
const getVersionFromTag = function(tag) {
  const parseVersion = function(seg) {
    // Handle upm suffix.
    const upmRe = /(_|-)(upm|master)$/i;
    seg = seg.replace(upmRe, "");
    return semver.clean(seg.toLowerCase(), { loose: true });
  };
  const parseSeg = function(tag, separator) {
    const segs = tag.split(separator);
    for (let i = 0; i < segs.length; i++) {
      const arr = segs.slice(segs.length - i - 1, segs.length);
      const text = arr.join(separator);
      version = parseVersion(text);
      if (version) return version;
    }
  };
  // Try parsing the tag.
  let version = parseVersion(tag);
  // Try parsing a path-like tag: prefix/{version}.
  if (!version) version = parseSeg(tag, "/");
  // Try parsing a hyphen-like tag: prefix-{version}.
  if (!version) version = parseSeg(tag, "-");
  // Try parsing a underscore-like tag: prefix_{version}.
  if (!version) version = parseSeg(tag, "_");
  return version;
};

module.exports = {
  semverRe,
  getVersionFromTag
};
