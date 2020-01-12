// Build package job
// Fetches package releases from git remote, then add necessary build-release jobs.
const config = require("config");
const { difference } = require("lodash");

const Release = require("../models/release");
const PackageExtra = require("../models/packageExtra");
const {
  ReleaseState,
  ReleaseReason,
  RetryableReleaseReason
} = require("../models/common");
const { queues, addJob } = require("../queues/core");
const { cleanRepoUrl, loadPackage } = require("../utils/package");
const { gitListRemoteTags } = require("../utils/git");
const { semverRe, getVersionFromTag } = require("../utils/semver");
const logger = require("../utils/log")(module);
const { removeRelease } = require("./removeRelease");

// Build package with given name.
const buildPackage = async function(name) {
  // Load package yaml file.
  logger.debug({ pkg: name }, "load yaml file");
  let pkg = await loadPackage(name);
  // Get remote tags.
  logger.debug({ pkg: name }, "get remote tags");
  let remoteTags = await gitListRemoteTags(cleanRepoUrl(pkg.repoUrl, "git"));
  let validTags = filterRemoteTags(remoteTags, pkg.gitTagIgnore);
  validTags.reverse();
  let invalidTags = difference(remoteTags, validTags);
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

// Filter remote tags for non-semver, duplication and ignoration.
const filterRemoteTags = function(remoteTags, gitTagIgnore) {
  // Filter out non-semver
  let tags = remoteTags.filter(x => semverRe.test(x.tag));
  // Filter out ignoration
  if (gitTagIgnore) {
    const ignoreRe = new RegExp(gitTagIgnore, "i");
    tags = tags.filter(x => !ignoreRe.test(x.tag));
  }
  // Filter out duplications
  // If tag "x.y.z" and "vx.y.z" both exist, keep the first one.
  let versionSet = new Set();
  let cleanTags = [];
  for (const element of tags) {
    let version = getVersionFromTag(element.tag);
    if (!versionSet.has(version)) {
      versionSet.add(version);
      cleanTags.push(element);
    }
  }
  return cleanTags;
};

// Update release records for given remoteTags.
const updateReleaseRecords = async function(packageName, remoteTags) {
  // Remove failed local releases that not listed in remoteTags
  let releases = await Release.fetchAll(packageName);
  for (const rel of releases) {
    if (rel.state == ReleaseState.Failed) {
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
