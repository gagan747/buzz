/* eslint-disable no-shadow */
const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, label, printf,
} = format;
require('winston-daily-rotate-file');
const winston = require('winston');

const transport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
});
const developmentLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);
  return createLogger({
    level: 'debug',
    format: combine(
      format.colorize(),
      label({ label: 'right asdg!' }),
      timestamp({ format: 'HH:mm:ss' }),
      myFormat,
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'errors.log',
        level: 'error',
      }),
      transport,
    ],
  });
};

module.exports = developmentLogger;
