// Show queue status
const { getQueue, hasQueue } = require("./core");
const logger = require("../utils/log")(module);

// Show queue status
const showQueueStatus = async function (queueName, verbose) {
  console.log(`######################## Queue ${queueName} ########################`);
  const queue = getQueue(queueName);
  const sections = [
    { name: "Waiting", getter: "getWaiting", counter: "getWaitingCount" },
    { name: "Active", getter: "getActive", counter: "getActiveCount" },
    { name: "Completed", getter: "getCompleted", counter: "getCompletedCount" },
    { name: "Failed", getter: "getFailed", counter: "getFailedCount" },
    { name: "Delayed", getter: "getDelayed", counter: "getDelayedCount" },
  ]
  let isDrained = true;
  for (const section of sections) {
    const count = await queue[section.counter]();
    if (count > 0) {
      isDrained = false;
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
  if (isDrained) {
    console.log("empty queue");
  }
};

module.exports = { showQueueStatus };

if (require.main === module) {
  let program = require("../utils/commander");
  let _queues = null;
  program
    .option("--verbose", "show verbose job info")
    .arguments("[queues...]")
    .action(function (queues) {
      for (const queueName of queues) {
        if (!hasQueue(queueName))
          throw new Error(`Can not recognize settings for queue name=${queueName}.`);
      }
      _queues = queues;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(async function () {
      for (const queueName of _queues) {
        await showQueueStatus(queueName, program.verbose);
      }
    });
}
