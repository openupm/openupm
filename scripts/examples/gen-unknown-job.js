// Generate unknown job type for testing.

const queue =  require('../../app/queues').background.emitter;
const logger = require('../../app/utils/log')(module);

var buildUnknown = async function () {
  let jobId = 'blar:blar';
  let payload = {};
  let job = await queue.createJob(payload).setId(jobId).save();
  logger.info('job added ' + job.id);
  return job;
};

if (require.main === module) {
  buildUnknown()
    .catch(console.log)
    .finally(() => process.exit(0));
}