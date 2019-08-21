// Generate release job.

const config = require('config');
const knex = require('../../app/db/postgres');
const { getQueue, QueueName } = require('../queue');
const emitterQueue = getQueue(QueueName.emitter);
const logger = require('../../app/utils/log')(module);

// Generate release job for given nameWithVersion.
const genReleaseJobForNameWithVersion = async function (nameWithVersion) {
  let query = knex('release').where({ name_with_version: nameWithVersion }).first();
  let release = await query;
  if (!release) {
    throw new Error("Release record not found, nameWithVersion=" + nameWithVersion);
  }
  return genReleaseJob(release);
}

// Generate release job for given release record.
const genReleaseJob = async function (release) {
  let jobId = config.jobs.release.key + ':' + release.id;
  let payload = {};
  let job = await emitterQueue.createJob(payload)
    .setId(jobId)
    .retries(config.jobs.release.retries)
    .backoff(...config.jobs.release.backoff)
    .save();
  if (job.id) {
    logger.info(`job added ${job.id}`);
    return job;
  }
  return null;
};

module.exports = {
  genReleaseJob,
};

if (require.main === module) {
  let program = require('commander');
  let nameWithVersion = null;
  let verValue = null;
  program
    .arguments('<name> <version>')
    .action(function (name, version) {
      nameWithVersion = name + '/' + version;
    })
    .parse(process.argv);
  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(1)
  } else {
    genReleaseJobForNameWithVersion(nameWithVersion)
      .catch(logger.error)
      .finally(() => process.exit(0));
  }
}
