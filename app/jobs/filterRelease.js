// Filter package releases

const semver = require("semver");
const redis = require("../db/redis");
const Release = require("../models/release");
const { ReleaseState } = require("../common/constant");

const validStateValues = ReleaseState.enums.map(item => item.value);

const parseStateFilter = function(arg) {
  const match = /^state(!=|=)(-?\d+)$/.exec(arg);
  if (!match) return null;

  const operator = match[1];
  const value = Number.parseInt(match[2], 10);
  if (!validStateValues.includes(value))
    throw new Error(`unsupported state value: ${value}`);

  return { operator, value };
};

const parseFilterArgs = function(args) {
  if (!args.length || args.length > 2)
    throw new Error("expected one or two filters");

  let packageName = null;
  let stateFilter = null;

  for (const arg of args) {
    const parsedState = parseStateFilter(arg);
    if (parsedState) {
      if (stateFilter) throw new Error("state filter specified more than once");
      stateFilter = parsedState;
    } else {
      if (packageName) throw new Error("package name specified more than once");
      packageName = arg;
    }
  }

  return { packageName, stateFilter };
};

const fetchAllReleases = async function() {
  const releases = [];
  const seenKeys = new Set();
  let cursor = "0";

  do {
    const resp = await redis.client.scan(cursor, "MATCH", "rel:*", "COUNT", 100);
    cursor = resp[0];
    const keys = resp[1];
    for (const key of keys) {
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      const values = await redis.client.hvals(key);
      for (const value of values) releases.push(JSON.parse(value));
    }
  } while (cursor !== "0");

  return releases;
};

const matchStateFilter = function(release, stateFilter) {
  if (!stateFilter) return true;
  if (stateFilter.operator === "=") return release.state === stateFilter.value;
  return release.state !== stateFilter.value;
};

const sortReleases = function(releases) {
  return releases.sort((a, b) => {
    if (a.packageName !== b.packageName)
      return a.packageName.localeCompare(b.packageName);
    return semver.compare(a.version, b.version);
  });
};

const filterReleases = async function({ packageName = null, stateFilter = null }) {
  const releases = packageName
    ? await Release.fetchAll(packageName)
    : await fetchAllReleases();

  return sortReleases(releases.filter(x => matchStateFilter(x, stateFilter)));
};

module.exports = {
  parseStateFilter,
  parseFilterArgs,
  fetchAllReleases,
  filterReleases,
};

if (require.main === module) {
  const program = require("../utils/commander");
  let filters = [];
  program
    .arguments("[filters...]")
    .action(function(args) {
      filters = args;
    })
    .parse(process.argv)
    .run(async function() {
      const parsed = parseFilterArgs(filters);
      const releases = await filterReleases(parsed);
      for (const release of releases) console.log(release);
    });
}
