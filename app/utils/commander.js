// Extension for node-commander.
let program = require('commander');

// Require n of arguments or exit.
program.requiredArgument = function (n) {
  if (process.argv.length < n + 2) {
    program.outputHelp();
    process.exit(1)
  }
  return program;
};

// Run method(...args) gracefully.
program.run = function (method, ...args) {
  method(...args)
    .catch((err) => {
      console.log(err);
      process.exit(1);
    })
    .finally(() => process.exit(0));
  return program;
};

module.exports = program;
