import express, { Application, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import winstonLogger from './startup/logging';
import config from './startup/config';
import routes from './startup/routes';
import { database } from './startup/database';
import { User, UserRequest } from './models/user';
import * as reqErrors from './util/requestErrors';

const app: Application = express();

// Set secure response headers.
app.use(helmet());

// Enable all CORS requests for development.
app.use(cors());

global.logger = winstonLogger;

// Set user in request.
app.use(async (req: UserRequest, res: Response, next: NextFunction) => {
  const user = await User.findOne();
  if (!user) {
    reqErrors.serverError(res, 'Base User not found.');
  } else {
    req.user = user!;
    next();
  }
});

config();
routes(app);

database();

const port = process.env.PORT || 3010;
const server = app.listen(port, () => {
  logger.info(`Listening on Port: ${port}`);
});

export default server;
