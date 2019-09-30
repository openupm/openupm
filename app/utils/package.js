// Packages util.
const assert = require("assert");
const fs = require("fs");
const parseGitHubUrl = require("parse-github-url");
const path = require("path");
const util = require("util");
const yaml = require("js-yaml");

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

// Package path.
const packagesDir = path.resolve(__dirname, "../../packages");

// Load package by name.
const loadPackage = async function(name) {
  let absPath = path.resolve(packagesDir, name + ".yml");
  return yaml.safeLoad(await readFile(absPath, "utf8"));
};

// Load package by name sync.
const loadPackageSync = function(name) {
  let absPath = path.resolve(packagesDir, name + ".yml");
  return yaml.safeLoad(fs.readFileSync(absPath, "utf8"));
};

// Load package names.
const loadPackageNames = async function() {
  let files = await readdir(packagesDir);
  // Find paths with *.ya?ml ext.
  return files
    .filter(p => (p.match(/.*\.(ya?ml)$/) || [])[1] !== undefined)
    .map(p => p.replace(/\.ya?ml$/, ""));
};

// Get clean repo url.
const cleanRepoUrl = function(url, format) {
  if (!format) format = "https";
  let ghUrl = parseGitHubUrl(url);
  if (format == "git") return `git@${ghUrl.hostname}:${ghUrl.repo}.git`;
  else if (format == "https") return `https://${ghUrl.hostname}/${ghUrl.repo}`;
  else throw new Error("format should be either https or git.");
};

module.exports = {
  cleanRepoUrl,
  loadPackage,
  loadPackageSync,
  loadPackageNames,
  packagesDir
};
