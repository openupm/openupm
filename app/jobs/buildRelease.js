"use strict";
// Build package release job.

const config = require("config");
const superagent = require("superagent");
const util = require("util");

const sleep = util.promisify(setTimeout);

const {
  ReleaseState,
  ReleaseReason,
  RetryableReleaseReason
} = require("../models/common");
const { Release } = require("../models/release");
const { cleanRepoUrl, loadPackage } = require("../utils/package");
const {
  getBuildApi,
  queueBuild,
  waitBuild,
  BuildStatus,
  BuildResult
} = require("../utils/azure");
const logger = require("../utils/log")(module);

// Build release for given id.
let buildRelease = async function(id) {
  // Get release record.
  let release = await Release.fetchOneOrThrow(id);
  // Load package.
  let pkg = await loadPackage(release.package_name);
  // Update release state.
  let shouldContinue = await updateReleaseState(release);
  if (!shouldContinue) return;
  // Get build api.
  let buildApi = await getBuildApi();
  // Update release build.
  await updateReleaseBuild(buildApi, pkg, release);
  // Wait release build.
  let build = await waitReleaseBuild(buildApi, release);
  // Handle release build.
  await handleReleaseBuild(build, release);
};

/* Update release state, return continue boolean.
 * - skip for succeeded state.
 * - continue for building state.
 * - continue for failed state with timeout reason.
 * - queue new build for pending and failed state with other reasons.
 */
const updateReleaseState = async function(release) {
  if (release.state == ReleaseState.Succeeded) {
    logger.info(`[id=${release.id}] skip for succeeded state`);
    return false;
  } else if (
    release.state == ReleaseState.Failed &&
    release.reason == ReleaseReason.BuildTimeout
  )
    await release.update({
      state: ReleaseState.Building.value,
      reason: ReleaseReason.None.value
    });
  else if (
    release.state == ReleaseState.Pending ||
    release.state == ReleaseState.Failed
  ) {
    await release.update({ state: ReleaseState.Building.value, build_id: "" });
  }
  return true;
};

// Update release build.
const updateReleaseBuild = async function(buildApi, pkg, release) {
  if (!release.build_id) {
    logger.info(`[id=${release.id}] queue build`);
    let definitionId = config.azureDevops.definitionId;
    let parameters = {
      repoUrl: cleanRepoUrl(pkg.repoUrl),
      repoBranch: release.tag,
      packageName: pkg.name,
      packageVersion: release.version,
      buildName: getBuildName({
        releaseId: release.id,
        packageName: pkg.name,
        packageVersion: release.version
      })
    };
    let build = await queueBuild(buildApi, definitionId, parameters);
    await release.update({ build_id: build.id + "" });
    await sleep(config.azureDevops.check.duration);
  }
};

// Wait release build.
const waitReleaseBuild = async function(buildApi, release) {
  logger.info(`[id=${release.id}] [buildId=${release.build_id}] wait build`);
  let build = await waitBuild(buildApi, release.build_id);
  return build;
};

// Handle release build.
const handleReleaseBuild = async function(build, release) {
  // Update publish log.
  if (release.build_id) {
    let publishLog = await getPublishLog(release);
    await release.update({ publish_log: publishLog });
  }
  // Handle build succeeded.
  if (
    build &&
    build.status == BuildStatus.Completed &&
    build.result == BuildResult.Succeeded
  ) {
    await release.update({
      state: ReleaseState.Succeeded.value,
      reason: ReleaseReason.None.value
    });
    logger.info(
      `[id=${release.id}] [buildId=${release.build_id}] build succeeded`
    );
  }
  // Handle build failed.
  else {
    let reason = ReleaseReason.None;
    if (build === null) reason = ReleaseReason.BuildTimeout;
    else if (build.status == BuildStatus.Cancelling)
      reason = ReleaseReason.BuildCancellation;
    else reason = await getReasonFromPublishLog(release.publish_log);
    await release.update({
      state: ReleaseState.Failed.value,
      reason: reason.value
    });
    let msg = `[id=${release.id}] [buildId=${release.build_id}] build failed with reason ${reason.key}`;
    logger.error(msg);
    // Throw error for retryable reason to retry.
    if (RetryableReleaseReason.includes(reason)) throw new Error(msg);
  }
};

// Get a custom build name.
const getBuildName = function({ releaseId, packageName, packageVersion }) {
  // Remove leading @ character of packageName.
  if (packageName.startsWith("@")) packageName = packageName.substr(1);
  let buildName = `rel${releaseId}-${packageName}#${packageVersion}`;
  // Replace not allowed characters (/:<>\|?@*) with underscore.
  buildName = buildName.replace(/[/:<>\\|?@*]/g, "_");
  /* The maximum length of a build number is 255 characters, and reserve 55
   * characters for runtime suffix. */
  return buildName.substr(0, 255 - 55);
};

// Get publish log
const getPublishLog = async function(release) {
  let resp = await superagent.get(release.buildPublishResultUrl);
  return resp.text;
};

// Get reason from publish log.
const getReasonFromPublishLog = async function(text) {
  if (text.includes("EPUBLISHCONFLICT")) return ReleaseReason.VersionConflict;
  else if (text.includes("ENOENT") && text.includes("error path package.json"))
    return ReleaseReason.PackageNotFound;
  else if (text.includes("error code E401")) return ReleaseReason.Unauthorized;
  else if (text.includes("error code E403")) return ReleaseReason.Forbidden;
  else if (text.includes("error code E500")) return ReleaseReason.InternalError;
  else if (text.includes("error code E502")) return ReleaseReason.BadGateway;
  else if (text.includes("error code E503"))
    return ReleaseReason.ServiceUnavailable;
  return ReleaseReason.None;
};

module.exports = { buildRelease };

if (require.main === module) {
  let program = require("../utils/commander");
  let releaseId = null;
  program
    .arguments("<id>")
    .action(function(id) {
      releaseId = parseInt(id);
    })
    .requiredArgs(1)
    .parse(process.argv)
    .run(buildRelease, releaseId);
}
