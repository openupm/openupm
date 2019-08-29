// Job queue process.

const config = require('config');

const queues = require('../app/queues');
const { buildProject } = require('./jobs/build-project');
const { buildRelease } = require('./jobs/build-release');
const logger = require('../app/utils/log')(module);

// const Bottleneck = require('bottleneck');
// const limiter = new Bottleneck({
//   maxConcurrent: 3,
//   minTime: 333,
// });
// limiter.schedule(() => {
// });

var dispatch = function (queue) {
  queue.on('ready', () => {
    logger.info('queue ready.');
  });
  queue.on('error', (err) => {
    logger.error('queue error: ', err);
  });
  queue.checkStalledJobs(config.jobs.checkStalledJobsInterval);
  queue.process(config.jobs.concurrent, async function (job) {
    logger.info(`[job=${job.id}] start`);
    let sections = job.id.split(':');
    try {
      if (sections[0] == config.jobs.project.key) {
        let projectId = parseInt(sections[1]);
        await buildProject(projectId);
      } else if (sections[0] == config.jobs.release.key) {
        let releaseId = parseInt(sections[1]);
        await buildRelease(releaseId);
      } else {
        throw new Error(`unknown job type ${sections[0]}`);
      }
    } catch (err) {
      logger.error(`[job=${job.id}] failed with error: `, err);
      throw err;
    }
    logger.info(`[job=${job.id}] completed`);
  });
};

if (require.main === module) {
  let program = require('../app/utils/commander');
  let queueWorker = null;
  program
    .arguments('<queue>')
    .action(function (queueName) {
      let queueHolder = queues[queueName];
      if (typeof queueHolder == 'undefined')
        throw new Error(`can not find queue name ${queueName}.`);
      queueWorker = queueHolder.worker;
    })
    .requiredArgument(1)
    .parse(process.argv)
    .run(dispatch, queueWorker);
}
