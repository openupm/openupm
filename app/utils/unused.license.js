// License util.
// License id   - license key of spdx or other vendors.
// License key  - license id in lowercase.
// License name - license name of spdx or other vendors.

const spdx = require("spdx-license-list");

// Convert object keys to lowercase.
let lowerObjectKeys = function(obj) {
  return Object.keys(obj).reduce(
    (c, k) => ((c[k.toLowerCase()] = obj[k]), c),
    {}
  );
};

// License data with lowercase key.
const licenses = {
  ...lowerObjectKeys(spdx),
  "unity-companion": {
    name: "Unity Companion License",
    url: "https://unity3d.com/legal/licenses/Unity_Companion_License",
    osiApproved: false
  }
};

// A list of license key.
const licenseKeys = Array.from(Object.keys(licenses));

// The potential license filenames in lowercase.
const licenseFilenames = ["license", "license.txt", "license.md"];

// Returns detected license key from given license body.
let detectLicenseKey = function(body) {
  body = body.toLowerCase();
  for (let key of licenseKeys) {
    let licenseName = licenses[key]["name"].toLowerCase();
    if (body.indexOf(licenseName) > -1) return key;
  }
  return null;
};

module.exports = {
  licenses,
  licenseKeys,
  licenseFilenames,
  detectLicenseKey
};
