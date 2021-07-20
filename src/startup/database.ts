import mongoose from 'mongoose';
import waitPort from 'wait-port';

import { dbURL, dbServer, dbPort } from '../util/dbURL';
import { User } from '../models/user';

export const database = async () => {
  logger.info(`Waiting for MongoDB on "${dbServer}:${dbPort}"`);

  const retVal = await waitPort({
    host: dbServer,
    port: 27017,
    output: 'silent',
    timeout: 10000,
  });

  if (!retVal) {
    logger.error(`Failed to contact MongoDB on "${dbServer}:${dbPort}"`);
    return;
  }

  // logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);

  try {
    logger.info(`Connecting to MongoDB on "${dbURL()}"`);

    const options = {
      useNewUrlParser: true,
      connectTimeoutMS: 10000,
      useUnifiedTopology: true,
    };

    await mongoose.connect(dbURL(), options);

    // Ensure we have base user in database.
    const user = await User.findOne();
    if (!user) {
      await User.create({ name: 'Keith', email: 'test@test.com' });
    }

    logger.info(`Connected to MongoDB on "${dbURL()}"`);
  } catch (err) {
    logger.error(`Failed connection to MongoDB on "${dbURL()}"`);
  }
};
