const fs = require("fs");
const parseGitHubUrl = require("parse-github-url");
const path = require("path");
const spdx = require("spdx-license-list");
const yaml = require("js-yaml");

const PACKAGE_LIMIT = Number(process.env.PACKAGE_LIMIT);
const dataDir = path.resolve(__dirname, "../data");
const packagesDir = path.resolve(dataDir, "packages");

const loadTopics = async function() {
  const absPath = path.resolve(dataDir, "topics.yml");
  return yaml.safeLoad(await fs.promises.readFile(absPath, "utf8")).topics;
};

const loadTopicsSync = function() {
  const absPath = path.resolve(dataDir, "topics.yml");
  return yaml.safeLoad(fs.readFileSync(absPath, "utf8")).topics;
};

const loadBlockedScopes = async function() {
  const absPath = path.resolve(dataDir, "blocked-scopes.yml");
  return yaml.safeLoad(await fs.promises.readFile(absPath, "utf8")).scopes;
};

const loadBlockedScopesSync = function() {
  const absPath = path.resolve(dataDir, "blocked-scopes.yml");
  return yaml.safeLoad(fs.readFileSync(absPath, "utf8")).scopes;
};

const loadPackageNames = async function(options) {
  const { sortKey } = options || {};
  let files = await fs.promises.readdir(packagesDir);
  if (sortKey == "mtime" || sortKey == "-mtime") {
    files.sort(function(a, b) {
      return (
        fs.statSync(path.join(packagesDir, a)).mtime.getTime() -
        fs.statSync(path.join(packagesDir, b)).mtime.getTime()
      );
    });
  } else if (sortKey == "name" || sortKey == "-name") {
    files.sort();
  }
  if (sortKey && sortKey.startsWith("-")) files.reverse();
  files = files
    .filter(p => (p.match(/.*\.(ya?ml)$/) || [])[1] !== undefined)
    .map(p => p.replace(/\.ya?ml$/, ""));
  if (PACKAGE_LIMIT > 0) files = files.slice(0, PACKAGE_LIMIT);
  return files;
};

const loadPackageNamesSync = function(options) {
  const { sortKey } = options || {};
  let files = fs.readdirSync(packagesDir);
  if (sortKey == "mtime" || sortKey == "-mtime") {
    files.sort(function(a, b) {
      return (
        fs.statSync(path.join(packagesDir, a)).mtime.getTime() -
        fs.statSync(path.join(packagesDir, b)).mtime.getTime()
      );
    });
  } else if (sortKey == "name" || sortKey == "-name") {
    files.sort();
  }
  if (sortKey && sortKey.startsWith("-")) files.reverse();
  files = files
    .filter(p => (p.match(/.*\.(ya?ml)$/) || [])[1] !== undefined)
    .map(p => p.replace(/\.ya?ml$/, ""));
  if (PACKAGE_LIMIT > 0) files = files.slice(0, PACKAGE_LIMIT);
  return files;
};

const loadPackageSync = function(name) {
  const absPath = path.resolve(packagesDir, name + ".yml");
  const doc = yaml.safeLoad(fs.readFileSync(absPath, "utf8"));
  return preparePackage(doc);
};

const ValidationError = class extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
  }
};

const validPackageName = function(packageName) {
  if (!packageName)
    throw new ValidationError("package name should not be empty", "empty");
  const maxLength = 214;
  if (packageName.length > maxLength)
    throw new ValidationError(
      `package name length should be less or equal to ${maxLength}, but length is ${packageName.length}`,
      "max-length-error"
    );
  const nameRe = /^[a-z0-9._-]+$/;
  if (!nameRe.test(packageName))
    throw new ValidationError(
      "package name should contain only lowercase letters, digits, hyphens(-), underscores (_), and periods (.)",
      "invalid-characters-error"
    );
  const items = packageName.split(".");
  if (items.length < 3)
    throw new ValidationError(
      "package name should conform to reverse domain name notation with at least 3 components (tld.org-name.pkg-name)",
      "invalid-scopes-error"
    );
  return true;
};

const isValidPackageName = function(packageName) {
  try {
    return [validPackageName(packageName), null];
  } catch (error) {
    if (error instanceof ValidationError) return [false, error];
    throw error;
  }
};

const isPackageBlockedByScope = function(packageName, scope) {
  if (scope.startsWith("^"))
    return packageName.startsWith(scope.slice(1, scope.length));
  return packageName == scope;
};

const preparePackage = function(doc) {
  const ghUrl = parseGitHubUrl(doc.repoUrl);
  doc.repo = ghUrl.repo;
  doc.owner = ghUrl.owner;
  doc.ownerUrl = `https://${ghUrl.hostname}/${ghUrl.owner}`;
  if (doc.hunter) {
    doc.hunterUrl = `https://${ghUrl.hostname}/${doc.hunter}`;
  } else {
    doc.hunter = "-";
    doc.hunterUrl = null;
  }
  if (doc.licenseSpdxId && spdx[doc.licenseSpdxId])
    doc.licenseName = spdx[doc.licenseSpdxId].name;
  const parentGHUrl = doc.parentRepoUrl
    ? parseGitHubUrl(doc.parentRepoUrl)
    : null;
  doc.parentRepo = parentGHUrl ? parentGHUrl.repo : null;
  doc.parentOwner = parentGHUrl ? parentGHUrl.owner : null;
  doc.parentOwnerUrl = parentGHUrl
    ? `https://${parentGHUrl.hostname}/${parentGHUrl.owner}`
    : null;
  if (!doc.readme) doc.readme = "master:README.md";
  doc.readme = doc.readme.trim();
  if (doc.readme.indexOf(":") == -1) doc.readme = "master:" + doc.readme;
  const [readmeBranch, readmePath] = doc.readme.split(":");
  const dirname = path.dirname(readmePath);
  doc.readmeBranch = readmeBranch;
  doc.readmeBase =
    dirname == "." ? readmeBranch : [readmeBranch, dirname].join("/");
  return doc;
};

module.exports = {
  dataDir,
  isPackageBlockedByScope,
  isValidPackageName,
  loadBlockedScopes,
  loadBlockedScopesSync,
  loadPackageNames,
  loadPackageNamesSync,
  loadPackageSync,
  loadTopics,
  loadTopicsSync,
  packagesDir
};
