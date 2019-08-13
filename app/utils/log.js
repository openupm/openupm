const path = require('path');
const winston = require('winston');
const { colorize, combine, timestamp, label, prettyPrint, json, printf } = winston.format;

const logDir = path.join(__dirname, '../../logs/');

// Return the last folder name of given module.
function getFilename(module) {
  return path.basename(module.filename, path.extname(module.filename));
};

function getLogger(module) {
  let logger = winston.createLogger({
    level: 'info',
    format: combine(
      label({ label: getFilename(module) }),
      timestamp(),
      json()
    ),
    transports: [],
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }));
    logger.add(new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }));
  } else {
    logger.add(new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        printf(info => `${info.timestamp} [${info.label}][${info.level}] ${info.message}`)
      ),
    }));
  }
  return logger;
}

module.exports = getLogger;
