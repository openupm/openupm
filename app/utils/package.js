// Packages util.
const fs = require("fs");
const parseGitHubUrl = require("parse-github-url");
const path = require("path");
const util = require("util");
const spdx = require("spdx-license-list");
const yaml = require("js-yaml");

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

// Paths.
const dataDir = path.resolve(__dirname, "../../data");
const packagesDir = path.resolve(dataDir, "packages");

// Load topics.
const loadTopics = async function() {
  try {
    let absPath = path.resolve(dataDir, "topics.yml");
    return yaml.safeLoad(await readFile(absPath, "utf8")).topics;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// Load package by name.
const loadPackage = async function(name) {
  try {
    let absPath = path.resolve(packagesDir, name + ".yml");
    return preparePackage(yaml.safeLoad(await readFile(absPath, "utf8")));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Load package by name (sync version).
const loadPackageSync = function(name) {
  try {
    let absPath = path.resolve(packagesDir, name + ".yml");
    return preparePackage(yaml.safeLoad(fs.readFileSync(absPath, "utf8")));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Load package names.
const loadPackageNames = async function() {
  let files = await readdir(packagesDir);
  // Find paths with *.ya?ml ext.
  return files
    .filter(p => (p.match(/.*\.(ya?ml)$/) || [])[1] !== undefined)
    .map(p => p.replace(/\.ya?ml$/, ""));
};

// Verify package name.
const packageExists = function(name) {
  let absPath = path.resolve(packagesDir, name + ".yml");
  return fs.existsSync(absPath);
};

// Get clean repo url.
const cleanRepoUrl = function(url, format) {
  if (!format) format = "https";
  const ghUrl = parseGitHubUrl(url);
  if (format == "git") return `git@${ghUrl.host}:${ghUrl.repo}.git`;
  else if (format == "https") return `https://${ghUrl.host}/${ghUrl.repo}`;
  else throw new Error("format should be either https or git.");
};

// Prepare package object, add or fix necessary properties.
const preparePackage = function(doc) {
  const ghUrl = parseGitHubUrl(doc.repoUrl);
  // repo
  doc.repo = ghUrl.repo;
  // owner
  doc.owner = ghUrl.owner;
  doc.ownerUrl = `https://${ghUrl.hostname}/${ghUrl.owner}`;
  doc.ownerAvatarUrl = doc.ownerUrl.toLowerCase().includes("github")
    ? `https://${ghUrl.hostname}/${ghUrl.owner}.png`
    : null;
  // hunter
  if (doc.hunter) {
    doc.hunterUrl = `https://${ghUrl.hostname}/${doc.hunter}`;
    doc.hunterAvatarUrl = `https://${ghUrl.hostname}/${doc.hunter}.png`;
  } else {
    doc.hunter = "-";
    doc.hunterUrl = null;
    doc.hunterAvatarUrl = null;
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
  doc.parentOwnerAvatarUrl =
    doc.parentOwnerUrl && doc.parentOwnerUrl.toLowerCase().includes("github")
      ? `https://${parentGHUrl.hostname}/${parentGHUrl.owner}.png`
      : null;
  return doc;
};

// Return namespace from package name
const getNamespace = function(packageName) {
  return packageName
    .split(".")
    .slice(0, 2)
    .join(".");
};

module.exports = {
  cleanRepoUrl,
  getNamespace,
  loadTopics,
  loadPackage,
  loadPackageSync,
  loadPackageNames,
  packageExists
};
