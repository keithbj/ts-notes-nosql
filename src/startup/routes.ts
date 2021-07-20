import express, { Application } from 'express';

import users from './../routes/users';
import notes from './../routes/notes';
import error from './../middleware/error';

export default function (app: Application) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/notes', notes);
  app.use(error);
}
