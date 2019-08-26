// Build azure pipelines
const azureDevops = require("azure-devops-node-api");
const { BuildStatus, BuildResult } = require("azure-devops-node-api/interfaces/BuildInterfaces");
const config = require('config');
const sleep = require('util').promisify(setTimeout);
const { $enum } = require('ts-enum-util');
const BuildStatusEnum = $enum(BuildStatus);
const BuildResultEnum = $enum(BuildResult);

const buildAzurePipelines = async function () {
  let authHandler = azureDevops.getPersonalAccessTokenHandler(config.azureDevops.token);
  let conn = new azureDevops.WebApi(config.azureDevops.endpoint, authHandler);
  var buildApi = await conn.getBuildApi();
  let build = await buildApi.queueBuild({
    definition: {
      id: config.azureDevops.definitionId
    },
    parameters:
      JSON.stringify(
        {
          repo_url: 'https://github.com/rotorz/unity3d-localized-strings.git',
          repo_branch: 'v1.0.0',
          build_tag: 'unity3d-localized-strings/1.0.0',
          // 'system.debug': true,
          // 'agent.diagnostic': true,
        }
      )
  }, config.azureDevops.project);
  for (let i = 0; i < config.azureDevops.retries; i++) {
    await sleep(config.azureDevops.retryDurationStep * (i + 1));
    build = await buildApi.getBuild(config.azureDevops.project, build.id);
    let statusName = BuildStatusEnum.getKeyOrThrow(build.status);
    let resultName = typeof build.result === 'undefined'
      ? 'undefined'
      : BuildResultEnum.getKeyOrThrow(build.result);
    console.log(`status: ${statusName}, result: ${resultName}`);
    switch (build.status) {
      case BuildStatus.Completed:
      case BuildStatus.Cancelling:
      case BuildStatus.Postponed:
        return build;
      case BuildStatus.None:
      case BuildStatus.InProgress:
      case BuildStatus.NotStarted:
        break;
      default:
        throw new Error(`Unknown build status ${build.status}`);
    }
  }
};

if (require.main === module) {
  buildAzurePipelines()
    .catch(console.log)
    .finally(() => process.exit(0));
}
