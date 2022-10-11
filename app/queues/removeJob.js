// Remove queue job

const { getQueue } = require("./core");
const logger = require("../utils/log")(module);

// Remove given job id
const removeJob = async function (queueName, jobId) {
  const queue = getQueue(queueName);
  const job = await queue.getJob(jobId);
  if (job) await queue.remove(jobId);
  else logger.warn({ jobId }, "Can not find the given jobId");
};

module.exports = { removeJob };

if (require.main === module) {
  const program = require("../utils/commander");
  let _queueName = null;
  let _jobId = null;
  program
    .arguments("<queueName> <jobId>")
    .action(function (queueName, jobId) {
      _queueName = queueName;
      _jobId = jobId;
    })
    .parse(process.argv)
    .requiredArgs(2)
    .run(async function () {
      await removeJob(_queueName, _jobId);
    });
}
