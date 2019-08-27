// Build release job.

'use strict';
const config = require('config');
const { $enum } = require('ts-enum-util');
const sleep = require('util').promisify(setTimeout);
const azureDevops = require("azure-devops-node-api");
const { BuildStatus, BuildResult } = require("azure-devops-node-api/interfaces/BuildInterfaces");
const BuildStatusEnum = $enum(BuildStatus);
const BuildResultEnum = $enum(BuildResult);

const { knex } = require('../../app/db/postgres');
const { ReleaseState } = require('../../app/models/common');
const { Project } = require('../../app/models/project');
const { Package } = require('../../app/models/package');
const { Release } = require('../../app/models/release');
const logger = require('../../app/utils/log')(module);

// Build release for given id.
let buildRelease = async function (id) {
  let release = await Release.fetchOne(id);
  let builder = new ReleaseBuilder(release);
  await builder.build();
}

// Release builder
class ReleaseBuilder {

  constructor(release) {
    this.release = release;
    this.buildApi = null;
  }

  async build() {
    // Skip if state is succeeded or failed.
    if (this.release.state == ReleaseState.succeeded) {
      logger.info(`[id=${this.release.id}] skip for state ${this.release.state}.`);
      return;
    }
    // Change release.state from pending/failed to building.
    if (this.release.state == ReleaseState.pending || this.release.state == ReleaseState.failed)
      await this.release.update({ state: ReleaseState.building, build_id: '' });
    // Prepare build api.
    this.buildApi = await this.getBuildApi();
    // Start new build pipelines if need.
    let build = null;
    if (!this.release.build_id) {
      build = await this.CreateBuildPipelines();
      await this.release.update({ build_id: build.id });
      await sleep(config.azureDevops.check.duration);
    }
    // Wait build pipelines to finish.
    build = await this.checkBuildPipelines();
    if (build === null) {
      // Pipelines timeout.
      await this.release.update({ state: ReleaseState.failed });
      throw new Error(`[id=${this.release.id}] [build_id=${this.release.build_id}] build pipelines timeout.`);
    } else if (build.status == BuildStatus.Completed && build.result == BuildResult.Succeeded) {
      // Pipelines succeeded.
      await this.release.update({ state: ReleaseState.succeeded });
      logger.info(`[id=${this.release.id}] [build_id=${this.release.build_id}] build pipelines succeeded.`);
    } else {
      // Pipelines failed.
      await this.release.update({ state: ReleaseState.failed });
      let statusName = BuildStatusEnum.getKeyOrThrow(build.status);
      let resultName = typeof build.result === 'undefined'
        ? 'undefined'
        : BuildResultEnum.getKeyOrThrow(build.result);
      throw new Error(`[id=${this.release.id}] [build_id=${this.release.build_id}] build pipelines failed, status ${statusName}, result ${resultName}`);
    }
  }

  // Create new build pipelines and return the build object.
  async CreateBuildPipelines() {
    logger.info(`[id=${this.release.id}] create build pipelines`);
    let pkg = await Package.fetchOne(this.release.package_id);
    let project = await Project.fetchOne(pkg.project_id);
    let build = await this.buildApi.queueBuild({
      definition: {
        id: config.azureDevops.definitionId
      },
      parameters:
        JSON.stringify(
          {
            repo_url: project.gitUrl,
            repo_branch: this.release.tag,
            package_name: pkg.name,
            package_ver: this.release.version,
          }
        )
    }, config.azureDevops.project);
    return build;
  }

  /* Check build pipelines. Return the build object if pipelines in completed
  or cancelling status. Return null if run out of retries. */
  async checkBuildPipelines() {
    logger.info(`[id=${this.release.id}] [build_id=${this.release.build_id}] check build pipelines`);
    for (let i = 0; i < config.azureDevops.check.retries; i++) {
      let build = await this.buildApi.getBuild(config.azureDevops.project, this.release.build_id);
      let statusName = BuildStatusEnum.getKeyOrThrow(build.status);
      let resultName = typeof build.result === 'undefined'
        ? 'undefined'
        : BuildResultEnum.getKeyOrThrow(build.result);
      logger.info(`[id=${this.release.id}] [build_id=${this.release.build_id}] status ${statusName}, result ${resultName}, retries ${i}`);
      if (build.status == BuildStatus.Completed || build.status == BuildStatus.Cancelling)
        return build;
      await sleep(config.azureDevops.check.retryIntervalStep * (i + 1));
    }
    return null;
  }

  // Return a build api instance.
  async getBuildApi() {
    let authHandler = azureDevops.getPersonalAccessTokenHandler(config.azureDevops.token);
    let conn = new azureDevops.WebApi(config.azureDevops.endpoint, authHandler);
    let buildApi = await conn.getBuildApi();
    return buildApi;
  }
}

module.exports = { buildRelease };

if (require.main === module) {
  let program = require('../../app/utils/commander');
  let releaseId = null;
  program
    .arguments('<id>')
    .action(function (id) { releaseId = parseInt(id); })
    .requiredArgument(1)
    .parse(process.argv)
    .run(buildRelease, releaseId);
}
