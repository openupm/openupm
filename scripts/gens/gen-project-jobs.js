// Generate all project build jobs.

const config = require('config');
const knex = require('../../app/db/postgres');
const { queue } = require('../queue');
const logger = require('../../app/utils/log')(module);

var buildProjects = async function () {
  let rows = await knex('project').select();
  for (let row of rows) {
    let jobId = config.job.keys.project + ':' + row.id;
    let payload = {};
    let job = await queue.createJob(payload).setId(jobId).save();
    if (job.id)
      logger.info(`job added ${job.id}`);
  }
  logger.info('done');
};

if (require.main === module) {
  buildProjects()
    .catch(console.log)
    .finally(() => process.exit(0));
}