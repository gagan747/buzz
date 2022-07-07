/* eslint-disable no-unused-vars */
const { createLogger, format, transports } = require('winston');
const winston = require('winston');

const {
  combine, timestamp, label, printf, json,
} = format;
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const productionLogger = () => createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'errors.log',
      level: 'error',
    }),
    transport,
  ],
});

module.exports = productionLogger;
