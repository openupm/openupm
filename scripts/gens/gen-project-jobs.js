// Generate project jobs.

const config = require('config');
const { Project } = require('../../app/models/project');
const queue =  require('../../app/queues').background.emitter;
const logger = require('../../app/utils/log')(module);

const genProjectJobs = async function (ids) {
  let lookup = null;
  if (ids && ids.length)
    lookup = (query) => query.whereIn('id', ids);
  let projects = await Project.fetchAll(lookup);
  for (let project of projects) {
    let jobId = config.jobs.project.key + ':' + project.id;
    let job = await queue.getJob(jobId);
    if (queue.isJobFailedCompletely(job)) {
      await queue.removeJob(job.id);
      logger.info(`[id=${project.id}] removed completely failed job ${jobId}.`);
      job = null;
    } else if (job != null) {
      logger.info(`[id=${project.id}] job existed. status=${job.status}, retries-left=${job.options.retries}.`);
      continue;
    }
    job = await queue.createJob({})
      .setId(jobId)
      .retries(config.jobs.project.retries)
      .backoff(...config.jobs.project.backoff)
      .save();
    if (job.id)
      logger.info(`[id=${project.id}] job added ${jobId}.`);
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
