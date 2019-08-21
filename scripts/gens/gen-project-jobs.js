// Generate project jobs.

const config = require('config');
const knex = require('../../app/db/postgres');
const { getQueue, QueueName } = require('../queue');
const emitterQueue = getQueue(QueueName.emitter);
const logger = require('../../app/utils/log')(module);

const genProjectJobs = async function (ids) {
  let query = knex('project').select();
  if (ids !== null && ids.length)
    query.whereIn('id', ids);
  let rows = await query;
  for (let row of rows) {
    let jobId = config.jobs.project.key + ':' + row.id;
    let payload = {};
    let job = await emitterQueue.createJob(payload)
      .setId(jobId)
      .retries(config.jobs.project.retries)
      .backoff(...config.jobs.project.backoff)
      .save();
    if (job.id)
      logger.info(`job added ${job.id}`);
  }
};

if (require.main === module) {
  let program = require('commander');
  let ids = null;
  program
    .arguments('[id...]')
    .action(function (args) {
      ids = args.map(x => parseInt(x)).filter(x => !isNaN(x));
    })
    .parse(process.argv);
  genProjectJobs(ids)
    .catch(logger.error)
    .finally(() => process.exit(0));
}
