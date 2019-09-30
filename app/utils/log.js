// Winston log util.
const path = require("path");
const winston = require("winston");

const logDir = path.join(__dirname, "../../logs/");

// Return the last folder name of given module.
const getFilename = function(module) {
  return path.basename(module.filename, path.extname(module.filename));
};

// Customized format.
const myFormat = winston.format.printf(info => {
  if (info.stack)
    return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}\n${info.stack}`;
  else
    return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`;
});

// Return logger for given module.
function getLogger(module) {
  let logger = null;
  if (process.env.NODE_ENV === "production") {
    // Log to files in production mode.
    logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.label({ label: getFilename(module) }),
        myFormat
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logDir, "error.log"),
          // filename: 'error.log',
          level: "error"
        }),
        new winston.transports.File({
          // filename: 'combined.log',
          filename: path.join(logDir, "combined.log")
        })
      ]
    });
  } else {
    // Log to console in development mode.
    logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.label({ label: getFilename(module) }),
        myFormat
      ),
      transports: [new winston.transports.Console({})]
    });
  }
  return logger;
}

module.exports = getLogger;
