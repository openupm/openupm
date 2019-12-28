// Extension for node-commander.
let program = require("commander");
var isPromise = require("is-promise");

// Run method(...args) gracefully.
program.run = async function(method, ...args) {
  try {
    let ret = method(...args);
    if (isPromise(ret)) await ret;
  } catch (err) {
    console.log(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

module.exports = program;
