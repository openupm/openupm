// Extension for node-commander.
let program = require("commander");
var isPromise = require("is-promise");

// Requires number of arguments, otherwise exit with code 1.
program.requiredArgs = function(n) {
  if (process.argv.length < n + 2) {
    program.outputHelp();
    process.exit(1);
  }
  return program;
};

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
