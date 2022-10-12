// Show queue status
const { getQueue } = require("./core");
const logger = require("../utils/log")(module);

// Show queue status
const showQueueStatus = async function (queueName, verbose) {
  const queue = getQueue(queueName);
  const sections = [
    { name: "Waiting", getter: "getWaiting", counter: "getWaitingCount" },
    { name: "Active", getter: "getActive", counter: "getActiveCount" },
    { name: "Completed", getter: "getCompleted", counter: "getCompletedCount" },
    { name: "Failed", getter: "getFailed", counter: "getFailedCount" },
    { name: "Delayed", getter: "getDelayed", counter: "getDelayedCount" },
  ]
  for (const section of sections) {
    const count = await queue[section.counter]();
    if (count > 0) {
      console.log(`${section.name} (${count}):`);
      const ls = await queue[section.getter]();
      for (const job of ls) {
        console.log(`  ${job.id}`);
        if (verbose) {
          console.log(`    name: ${job.name}`);
          const data = JSON.stringify(job.data, undefined, 0);
          if (job.data) console.log(`    data: ${data}`);
          const opts = JSON.stringify(job.opts, undefined, 0);
          if (job.opts) console.log(`    opts: ${opts}`);
        }
      }
    }
  }
};

module.exports = { showQueueStatus };

if (require.main === module) {
  let program = require("../utils/commander");
  let _queueName = null;
  program
    .option("--verbose", "show verbose job info")
    .arguments("<queueName>")
    .action(queueName => {
      _queueName = queueName;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(showQueueStatus, _queueName, program.verbose);
}
