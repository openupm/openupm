// Remove queue job

const { queues } = require("./core");

// Remove given job id
const removeJob = async function(queueName, jobId) {
  let queue = queues[queueName].emitter;
  const job = await queue.getJob(jobId);
  if (job) await queue.removeJob(jobId);
  else console.log("job not found");
};

module.exports = { removeJob };

if (require.main === module) {
  let program = require("../utils/commander");
  let _queueName = null;
  let _jobId = null;
  program
    .arguments("<queueName> <jobId>")
    .action(function(queueName, jobId) {
      _queueName = queueName;
      _jobId = jobId;
    })
    .parse(process.argv)
    .requiredArgs(2)
    .run(async function() {
      await removeJob(_queueName, _jobId);
    });
}
