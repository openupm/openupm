// Packages util.
const fs = require("fs");
const parseGitHubUrl = require("parse-github-url");
const path = require("path");
const util = require("util");
const spdx = require("spdx-license-list");
const yaml = require("js-yaml");

const { isValidPackageName, validPackageName } = require("../common/utils");
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);

const PACKAGE_LIMIT = Number(process.env.PACKAGE_LIMIT);

// Paths.
const dataDir = path.resolve(__dirname, "../../data");
const packagesDir = path.resolve(dataDir, "packages");

// Load topics.
const loadTopics = async function () {
  try {
    let absPath = path.resolve(dataDir, "topics.yml");
    return yaml.safeLoad(await readFile(absPath, "utf8")).topics;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// Load package by name.
const loadPackage = async function (name) {
  try {
    let absPath = path.resolve(packagesDir, name + ".yml");
    return preparePackage(yaml.safeLoad(await readFile(absPath, "utf8")));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Load raw package by name.
const loadRawPackage = async function (name) {
  try {
    let absPath = path.resolve(packagesDir, name + ".yml");
    return yaml.safeLoad(await readFile(absPath, "utf8"));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Save raw package by name.
const saveRawPackage = async function (name, obj) {
  try {
    let absPath = path.resolve(packagesDir, name + ".yml");
    const content = yaml.safeDump(obj);
    await writeFile(absPath, content);
  } catch (e) {
    console.error(e);
  }
};

// Load package by name (sync version).
const loadPackageSync = function (name) {
  try {
    let absPath = path.resolve(packagesDir, name + ".yml");
    return preparePackage(yaml.safeLoad(fs.readFileSync(absPath, "utf8")));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Load package names.
const loadPackageNames = async function (options) {
  const { sortKey } = options || {};
  let files = await readdir(packagesDir);
  // Sort
  if (sortKey == "mtime" || sortKey == "-mtime") {
    files.sort(function (a, b) {
      return (
        fs.statSync(path.join(packagesDir, a)).mtime.getTime() -
        fs.statSync(path.join(packagesDir, b)).mtime.getTime()
      );
    });
  } else if (sortKey == "name" || sortKey == "-name") {
    files.sort();
  }
  if (sortKey && sortKey.startsWith("-")) files.reverse();
  // Find paths with *.ya?ml ext.
  files = files
    .filter(p => (p.match(/.*\.(ya?ml)$/) || [])[1] !== undefined)
    .map(p => p.replace(/\.ya?ml$/, ""));
  if (PACKAGE_LIMIT > 0) {
    files = files.slice(0, PACKAGE_LIMIT);
  }
  return files;
};

// Load built-in package names.
const loadBuiltinPackageNames = async function () {
  try {
    let absPath = path.resolve(dataDir, "builtin.yml");
    return yaml.safeLoad(await readFile(absPath, "utf8")).packages;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// Load blocked scopes.
const loadBlockedScopes = async function () {
  try {
    let absPath = path.resolve(dataDir, "blocked-scopes.yml");
    return yaml.safeLoad(await readFile(absPath, "utf8")).scopes;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// Verify package name.
const packageExists = function (name) {
  let absPath = path.resolve(packagesDir, name + ".yml");
  return fs.existsSync(absPath);
};

// Get clean repo url.
const cleanRepoUrl = function (url, format) {
  if (!format) format = "https";
  const ghUrl = parseGitHubUrl(url);
  if (format == "git") return `git@${ghUrl.host}:${ghUrl.repo}.git`;
  else if (format == "https") return `https://${ghUrl.host}/${ghUrl.repo}`;
  else throw new Error("format should be either https or git.");
};

// Prepare package object, add or fix necessary properties.
const preparePackage = function (doc) {
  const ghUrl = parseGitHubUrl(doc.repoUrl);
  // repo
  doc.repo = ghUrl.repo;
  // owner
  doc.owner = ghUrl.owner;
  doc.ownerUrl = `https://${ghUrl.hostname}/${ghUrl.owner}`;
  // hunter
  if (doc.hunter) {
    doc.hunterUrl = `https://${ghUrl.hostname}/${doc.hunter}`;
  } else {
    doc.hunter = "-";
    doc.hunterUrl = null;
  }
  // license
  if (doc.licenseSpdxId && spdx[doc.licenseSpdxId])
    doc.licenseName = spdx[doc.licenseSpdxId].name;
  // parent
  const parentGHUrl = doc.parentRepoUrl
    ? parseGitHubUrl(doc.parentRepoUrl)
    : null;
  doc.parentRepo = parentGHUrl ? parentGHUrl.repo : null;
  doc.parentOwner = parentGHUrl ? parentGHUrl.owner : null;
  doc.parentOwnerUrl = parentGHUrl
    ? `https://${parentGHUrl.hostname}/${parentGHUrl.owner}`
    : null;
  // readme
  if (!doc.readme) {
    doc.readme = "master:README.md";
  }
  doc.readme = doc.readme.trim();
  if (doc.readme.indexOf(":") == -1) {
    doc.readme = "master:" + doc.readme;
  }
  const [readmeBranch, readmePath] = doc.readme.split(":");
  const dirname = path.dirname(readmePath);
  doc.readmeBranch = readmeBranch;
  doc.readmeBase =
    dirname == "." ? readmeBranch : [readmeBranch, dirname].join("/");
  return doc;
};

// Return namespace from package name
const getNamespace = function (packageName) {
  return packageName
    .split(".")
    .slice(0, 2)
    .join(".");
};

module.exports = {
  cleanRepoUrl,
  dataDir,
  getNamespace,
  loadTopics,
  loadPackage,
  loadRawPackage,
  loadPackageSync,
  loadPackageNames,
  loadBuiltinPackageNames,
  loadBlockedScopes,
  isValidPackageName,
  packageExists,
  packagesDir,
  saveRawPackage,
  validPackageName
};
