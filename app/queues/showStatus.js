// Show queue status
const redis = require("../db/redis");

// Show queue status
const showQueueStatus = async function(queueName) {
  const statusList = [
    { name: "waiting", type: "list" },
    { name: "active", type: "list" },
    { name: "succeeded", type: "set" },
    { name: "failed", type: "set" },
    { name: "delayed", type: "sorted-set" },
    { name: "stalling", type: "set" }
  ];
  for (const status of statusList) {
    let ls = null;
    if (status.type == "list")
      ls = await redis.client.lrange(`bq:${queueName}:${status.name}`, 0, -1);
    else if (status.type == "set")
      ls = await redis.client.smembers(`bq:${queueName}:${status.name}`);
    else if (status.type == "sorted-set")
      ls = await redis.client.zrange(`bq:${queueName}:${status.name}`, 0, -1);
    if (ls == null) continue;
    ls = Array.from(ls);
    if (ls.length) {
      console.log(`${status.name}:`);
      ls.sort();
      for (const item of ls) console.log(`  ${item}`);
    }
  }
};

module.exports = { showQueueStatus };

if (require.main === module) {
  let program = require("../utils/commander");
  let _queueName = null;
  program
    .arguments("<queueName>")
    .action(queueName => {
      _queueName = queueName;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(showQueueStatus, _queueName);
}
