// Generate project jobs.

const config = require('config');
const { Project } = require('../../app/models/project');
const { getQueue, QueueName } = require('../queue');
const emitterQueue = getQueue(QueueName.emitter);
const logger = require('../../app/utils/log')(module);

const genProjectJobs = async function (ids) {
  let lookup = null;
  if (ids && ids.length)
    lookup = (query) => query.whereIn('id', ids);
  let projects = await Project.fetchAll(lookup);
  for (let project of projects) {
    let jobId = config.jobs.project.key + ':' + project.id;
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
  let program = require('../../app/utils/commander');
  let ids = null;
  program
    .arguments('[id...]')
    .action(function (args) {
      ids = args.map(x => parseInt(x)).filter(x => !isNaN(x));
    })
    .parse(process.argv)
    .run(genProjectJobs, ids);
}
