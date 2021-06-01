// Azure util.
const Enum = require("enum");
const urljoin = require("url-join");

const azureDevops = require("azure-devops-node-api");
const buildInterfaces = require("azure-devops-node-api/interfaces/BuildInterfaces");
const config = require("config");

const util = require("util");

const BuildStatus = new Enum(buildInterfaces.BuildStatus);
const BuildResult = new Enum(buildInterfaces.BuildResult);
const sleep = util.promisify(setTimeout);

const logger = require("./log")(module);

// Get build api.
const getBuildApi = async function() {
  let authHandler = azureDevops.getPersonalAccessTokenHandler(
    config.azureDevops.token
  );
  let conn = new azureDevops.WebApi(config.azureDevops.endpoint, authHandler);
  let buildApi = await conn.getBuildApi();
  return buildApi;
};

// Queue build in azure pipelines and return the build object.
const queueBuild = async function(buildApi, definitionId, parameters) {
  let build = await buildApi.queueBuild(
    {
      definition: {
        id: definitionId
      },
      parameters: JSON.stringify(parameters)
    },
    config.azureDevops.project
  );
  return build;
};

/* Wait build until completed or cancelling, and return build object.
 * If run out of retries, return null. */
const waitBuild = async function(buildApi, buildId) {
  for (let i = 0; i < config.azureDevops.check.retries; i++) {
    let build = await buildApi.getBuild(config.azureDevops.project, buildId);
    let status = BuildStatus.get(build.status);
    let result = BuildResult.get(build.result);
    logger.debug({ buildId, status, result }, "wait build");
    if (status == BuildStatus.Completed || status == BuildStatus.Cancelling)
      return build;
    await sleep(config.azureDevops.check.retryIntervalStep * (i + 1));
  }
  return null;
};

// Return the build logs URL for raw log indexes.
const getBuildLogsUrl = function(buildId) {
  return urljoin(
    config.azureDevops.buildUrlBase,
    "_apis/build/builds/",
    buildId + "",
    "logs"
  );
};

// Return the build step log URL.
const getBuildSectionLogUrl = function(buildId, stepId) {
  return urljoin(
    config.azureDevops.buildUrlBase,
    "_apis/build/builds/",
    buildId + "",
    "logs",
    stepId + ""
  );
};

module.exports = {
  getBuildApi,
  getBuildLogsUrl,
  getBuildSectionLogUrl,
  queueBuild,
  waitBuild,
  BuildStatus,
  BuildResult
};
