require('express-async-errors');
import waitPort from 'wait-port';
import winston from 'winston';
const { createLogger, format } = winston;
const { combine, timestamp, colorize, simple, json } = format;
const transports: any = winston.transports;
require('winston-mongodb');

import { dbURL, dbServer, dbPort } from '../util/dbURL';

// Declaration to add logger to global.
declare global {
  // Extend the Global interface for the NodeJS namespace.
  namespace NodeJS {
    interface Global {
      logger: winston.Logger;
    }
  }
  // Simply call logger.* from anywhere in our code.
  const logger: winston.Logger;
}

const logger = createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({
      filename: 'logs/combined.log',
      level: 'info',
      handleExceptions: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: combine(colorize(), simple()),
      handleExceptions: true,
    })
  );
}

waitPort({
  host: dbServer,
  port: 27017,
  output: 'silent',
  timeout: 10000,
}).then((open) => {
  if (open) {
    logger.add(
      new transports.MongoDB({
        level: 'info',
        db: dbURL(),
        collection: 'error_logs',
        handleExceptions: true,
      })
    );
  } else {
    logger.error('Failed to add MongoDB Winston logging transport.');
  }
});

// Re-thow to be caught by winston's default uncaughtExceptions handler.
process.on('unhandledRejection', (ex) => {
  throw ex;
});

export default logger;
