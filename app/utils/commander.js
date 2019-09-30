// Extension for node-commander.
let program = require("commander");

// Require n of arguments or exit.
program.requiredArgument = function(n) {
  if (process.argv.length < n + 2) {
    program.outputHelp();
    process.exit(1);
  }
  return program;
};

// Return true if given value is a promise object.
const isPromise = function(value) {
  return Boolean(value && typeof value.then === "function");
};

// Run method(...args) gracefully.
program.run = function(method, ...args) {
  let ret = method(...args);
  if (isPromise(ret))
    ret
      .catch(err => {
        console.log(err);
        process.exit(1);
      })
      .finally(() => process.exit(0));
};

module.exports = program;
