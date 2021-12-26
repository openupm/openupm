// Build package job
// Fetches package releases from git remote, then add necessary build-release jobs.
const config = require("config");
const { differenceBy } = require("lodash/array");

const Release = require("../models/release");
const PackageExtra = require("../models/packageExtra");
const {
  ReleaseState,
  ReleaseReason,
  RetryableReleaseReason
} = require("../common/constant");
const { queues, addJob } = require("../queues/core");
const { cleanRepoUrl, loadPackage } = require("../utils/package");
const { gitListRemoteTags } = require("../utils/git");
const { getVersionFromTag } = require("../utils/semver");
const logger = require("../utils/log")(module);
const { removeRelease } = require("./removeRelease");
const semverCompare = require("semver-compare");

// Build package with given name.
const buildPackage = async function(name) {
  // Load package yaml file.
  logger.debug({ pkg: name }, "load yaml file");
  let pkg = await loadPackage(name);
  // Get remote tags.
  logger.debug({ pkg: name }, "get remote tags");
  let remoteTags = [];
  try {
    remoteTags = await gitListRemoteTags(cleanRepoUrl(pkg.repoUrl, "git"));
    await PackageExtra.setRepoUnavailable(name, false);
  } catch (error) {
    // If repository has became private or been removed...
    if (error.message.includes("ERROR: Repository not found")) {
      await PackageExtra.setRepoUnavailable(name, true);
      return;
    }
    throw error;
  }
  let validTags = filterRemoteTags({
    remoteTags,
    gitTagIgnore: pkg.gitTagIgnore,
    gitTagPrefix: pkg.gitTagPrefix,
    minVersion: (pkg.minVersion || "").trim()
  });
  validTags.reverse();
  let invalidTags = getInvalidTags({
    remoteTags,
    validTags,
    gitTagIgnore: pkg.gitTagIgnore,
    gitTagPrefix: pkg.gitTagPrefix,
    minVersion: (pkg.minVersion || "").trim()
  });
  await PackageExtra.setInvalidTags(name, invalidTags);
  if (!validTags.length) {
    logger.info({ pkg: name }, "no valid tags found");
    return;
  }
  // Update release records.
  logger.debug({ pkg: name }, "update release records");
  let releases = await updateReleaseRecords(pkg.name, validTags);
  // Add necessary build release jobs.
  logger.debug({ pkg: name }, "add release jobs");
  await addReleaseJobs(releases);
};

// Filter remote tags for non-semver, duplication, ignoration, and minVersion.
const filterRemoteTags = function({
  remoteTags,
  gitTagIgnore,
  gitTagPrefix,
  minVersion
}) {
  let tags = remoteTags;
  // Filter prefix based on raw tag.
  if (gitTagPrefix) tags = tags.filter(x => x.tag.startsWith(gitTagPrefix));
  // Filter out non-semver based on parsed version.
  tags = tags.filter(x => getVersionFromTag(x.tag) != null);
  // Filter out ignoration based on raw tag.
  if (gitTagIgnore) {
    const ignoreRe = new RegExp(gitTagIgnore, "i");
    tags = tags.filter(x => !ignoreRe.test(x.tag));
  }
  // Tags with "upm/" prefix or "-upm" suffix have high priority.
  const upmRe = /(^upm\/|(_|-)upm$)/i;
  const validTags = tags.filter(x => upmRe.test(x.tag));
  const versionSet = new Set(validTags.map(x => getVersionFromTag(x.tag)));
  // Filter minVersion.
  if (minVersion) {
    try {
      tags = tags.filter(
        x =>
          semverCompare(
            getVersionFromTag(x.tag),
            getVersionFromTag(minVersion)
          ) >= 0
      );
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
  // Remove duplications.
  for (const element of tags) {
    const version = getVersionFromTag(element.tag);
    if (!versionSet.has(version)) {
      versionSet.add(version);
      validTags.push(element);
    }
  }
  return validTags;
};

/**
 * Return invalid tags. Tags have been ignored, without the given prefix, or filtered by
 * minVersion are not considered invalid.
 */
const getInvalidTags = function({
  remoteTags,
  validTags,
  gitTagIgnore,
  gitTagPrefix,
  minVersion
}) {
  let tags = differenceBy(remoteTags, validTags, x => x.tag);
  if (gitTagPrefix) {
    tags = tags.filter(x => x.tag.startsWith(gitTagPrefix));
  }
  if (gitTagIgnore) {
    const ignoreRe = new RegExp(gitTagIgnore, "i");
    tags = tags.filter(x => !ignoreRe.test(x.tag));
  }
  if (minVersion) {
    try {
      tags = tags.filter(
        x =>
          semverCompare(
            getVersionFromTag(x.tag),
            getVersionFromTag(minVersion)
          ) >= 0
      );
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
  return tags;
};

// Update release records for given remoteTags.
const updateReleaseRecords = async function(packageName, remoteTags) {
  // Remove failed local releases that not listed in remoteTags
  let releases = await Release.fetchAll(packageName);
  for (const rel of releases) {
    if (rel.state == ReleaseState.Failed) {
      // Remove failed but disappeared release. It happens when
      // the remote tag has been removed
      // the remote tag has been re-tagged
      if (!remoteTags.find(x => x.tag == rel.tag && x.commit == rel.commit)) {
        logger.warn(
          {
            pkg: packageName,
            rel: `${packageName}@${rel.version}`,
            tag: rel.tag,
            commit: rel.commit
          },
          "remove failed release that not listed in remoteTags"
        );
        await removeRelease(packageName, rel.version);
      }
    }
  }
  // Convert remoteTags to releases
  releases = [];
  for (const remoteTag of remoteTags) {
    let version = getVersionFromTag(remoteTag.tag);
    let release = await Release.fetchOne(packageName, version);
    if (!release) {
      let record = {
        packageName,
        version,
        commit: remoteTag.commit,
        tag: remoteTag.tag
      };
      release = await Release.save(record);
    }
    releases.push(release);
  }
  return releases;
};

// Add build release jobs for given release records.
const addReleaseJobs = async function(releases) {
  let queue = queues.main.emitter;
  let i = 0;
  for (let rel of releases) {
    let reason = ReleaseReason.get(rel.reason);
    let jobId =
      config.jobs.buildRelease.key + ":" + rel.packageName + ":" + rel.version;
    let job = await queue.getJob(jobId);
    // // Clean complete failed job to continue
    // if (queue.isJobFailedCompletely(job)) {
    //   await queue.removeJob(job.id);
    //   logger.info(
    //     { rel: `${rel.packageName}@${rel.version}`, pkg: name },
    //     "removed job failed completely"
    //   );
    //   job = null;
    // }
    // Skip creating release job if,
    // - job already exists.
    // - release already succeeded.
    // - release failed and no need to retry.
    if (
      job ||
      rel.state == ReleaseState.Succeeded ||
      (rel.state == ReleaseState.Failed &&
        !RetryableReleaseReason.includes(reason))
    )
      continue;
    // Generate release job.
    var dt = new Date();
    dt.setSeconds(dt.getSeconds() + config.jobs.buildRelease.delay * i);
    job = await addJob({
      jobId,
      jobConfig: config.jobs.buildRelease,
      delay: i == 0 ? 0 : dt
    });
    i += 1;
  }
};

module.exports = { buildPackage };

if (require.main === module) {
  let program = require("../utils/commander");
  let packageName = null;
  program
    .arguments("<name>")
    .action(name => {
      packageName = name;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(buildPackage, packageName);
}
