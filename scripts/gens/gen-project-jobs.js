// Generate project jobs.

const config = require('config');
const knex = require('../../app/db/postgres');
const { queue } = require('../queue');
const logger = require('../../app/utils/log')(module);

const genProjectJobs = async function (ids) {
  let query = knex('project').select();
  if (ids !== null && ids.length)
    query.whereIn('id', ids);
  let rows = await query;
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
  let program = require('commander');
  let ids = null;
  program
    .arguments('[id...]')
    .action(function (args) {
      ids = args.map(x => parseInt(x)).filter(x => !isNaN(x))
    })
    .parse(process.argv);
  genProjectJobs(ids)
    .catch(logger.error)
    .finally(() => process.exit(0));
}
