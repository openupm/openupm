// Winston log util.
const bunyan = require("bunyan");
const path = require("path");
const { isString } = require("lodash/lang");

// Return log name for given module
const getLogName = function(module) {
  const filename = path.basename(
    module.filename,
    path.extname(module.filename)
  );
  const dir = path
    .dirname(module.filename)
    .split(path.sep)
    .splice(-1)[0];
  let name = `${dir}.${filename}`;
  return name;
};

// Create logger for given module
function createLogger(module) {
  const name = isString(module) ? module : getLogName(module);
  if (process.env.NODE_ENV === "test")
    return bunyan.createLogger({
      name,
      serializers: bunyan.stdSerializers,
      streams: [{ level: "fatal", stream: process.stdout }]
    });
  else {
    return bunyan.createLogger({
      name,
      serializers: bunyan.stdSerializers,
      streams: [
        {
          level: process.env.OPENUPM_DEBUG ? "debug" : "info",
          stream: process.stdout
        },
        { level: "error", stream: process.stderr }
      ]
    });
  }
}

module.exports = createLogger;
