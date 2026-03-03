// Filter package releases

const semver = require("semver");
const redis = require("../db/redis");
const Release = require("../models/release");
const { ReleaseState, ReleaseReason } = require("../common/constant");

const validStateValues = ReleaseState.enums.map(item => item.value);
const validReasonValues = ReleaseReason.enums.map(item => item.value);
const filterSpecs = {
  state: {
    key: "stateFilter",
    validValues: validStateValues,
    allowNotEqual: false,
  },
  reason: {
    key: "reasonFilter",
    validValues: validReasonValues,
    allowNotEqual: false,
  },
};

const parseFilterToken = function(arg) {
  const match = /^([a-zA-Z][a-zA-Z0-9_-]*)(!?=)(-?\d+)$/.exec(arg);
  if (!match) return null;

  const field = match[1];
  const operator = match[2];
  const value = Number.parseInt(match[3], 10);
  const spec = filterSpecs[field];
  if (!spec) throw new Error(`unsupported filter field: ${field}`);
  if (operator === "!=" && !spec.allowNotEqual)
    throw new Error(`${field} filter only supports equality`);
  if (!spec.validValues.includes(value))
    throw new Error(`unsupported ${field} value: ${value}`);

  return {
    field,
    key: spec.key,
    filter: { value },
  };
};

const parseStateFilter = function(arg) {
  const parsed = parseFilterToken(arg);
  if (!parsed || parsed.field !== "state") return null;
  return parsed.filter;
};

const parseReasonFilter = function(arg) {
  const parsed = parseFilterToken(arg);
  if (!parsed || parsed.field !== "reason") return null;
  return parsed.filter;
};

const parseFilterArgs = function(args) {
  if (!args.length || args.length > 3)
    throw new Error("expected one to three filters");

  let packageName = null;
  let stateFilter = null;
  let reasonFilter = null;

  for (const arg of args) {
    const parsedFilter = parseFilterToken(arg);
    if (parsedFilter) {
      if (parsedFilter.key === "stateFilter") {
        if (stateFilter)
          throw new Error("state filter specified more than once");
        stateFilter = parsedFilter.filter;
      } else if (parsedFilter.key === "reasonFilter") {
        if (reasonFilter)
          throw new Error("reason filter specified more than once");
        reasonFilter = parsedFilter.filter;
      }
    } else {
      if (packageName) throw new Error("package name specified more than once");
      packageName = arg;
    }
  }

  return { packageName, stateFilter, reasonFilter };
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
  return release.state === stateFilter.value;
};

const matchReasonFilter = function(release, reasonFilter) {
  if (!reasonFilter) return true;
  return release.reason === reasonFilter.value;
};

const sortReleases = function(releases) {
  return releases.sort((a, b) => {
    if (a.packageName !== b.packageName)
      return a.packageName.localeCompare(b.packageName);
    return semver.compare(a.version, b.version);
  });
};

const filterReleases = async function({
  packageName = null,
  stateFilter = null,
  reasonFilter = null,
}) {
  const releases = packageName
    ? await Release.fetchAll(packageName)
    : await fetchAllReleases();

  return sortReleases(
    releases.filter(
      x => matchStateFilter(x, stateFilter) && matchReasonFilter(x, reasonFilter)
    )
  );
};

module.exports = {
  parseStateFilter,
  parseReasonFilter,
  parseFilterArgs,
  fetchAllReleases,
  filterReleases,
};

if (require.main === module) {
  const program = require("../utils/commander");
  let filters = [];
  program
    .description("List releases filtered by package name, state, and reason.")
    .usage("<filter> [filter] [filter]")
    .arguments("[filters...]")
    .action(function(args) {
      filters = args;
    })
    .on("--help", function() {
      console.log("");
      console.log("Supported filters:");
      console.log("  packageName    Optional package name");
      console.log("  state=VALUE    Match ReleaseState exactly");
      console.log("  reason=VALUE   Match ReleaseReason exactly");
      console.log("");
      console.log("Examples:");
      console.log("  $ npm run rel:filter -- com.example.app");
      console.log("  $ npm run rel:filter -- state=0");
      console.log("  $ npm run rel:filter -- reason=902");
      console.log("  $ npm run rel:filter -- com.example.app state=3 reason=902");
    })
    .parse(process.argv)
    .run(async function() {
      const parsed = parseFilterArgs(filters);
      const releases = await filterReleases(parsed);
      for (const release of releases) console.log(release);
    });
}
