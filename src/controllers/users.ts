import { RequestHandler } from 'express';
import HttpStatus from 'http-status-codes';

import { User, validate } from '../models/user';
import * as reqErrors from '../util/requestErrors';

export const createUser: RequestHandler = async (req, res) => {
  const values = {
    name: req.body.name,
    email: req.body.email,
  };

  const error = validate(values);

  if (error) {
    reqErrors.badRequest(res, 'createUser failed validation: ', error!);
  } else {
    const user = await User.create(values);
    res.status(HttpStatus.CREATED).send(user);
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

export const updateUser: RequestHandler = async (req, res) => {
  const values = {
    name: req.body.name,
    email: req.body.email,
  };

  const error = validate(values);
  if (error) {
    return reqErrors.badRequest(res, 'updateUser failed validation: ', error);
  }

  let user = await User.findByIdAndUpdate(req.params.id, values, { new: true });
  if (!user) {
    reqErrors.notFound(res, `updateUser UserId "${req.params.id}" not found.`);
  } else {
    res.send(user);
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  let user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    reqErrors.notFound(res, `deleteUser UserId "${req.params.id}" not found.`);
  } else {
    res.send(user);
  }
};

export const getUser: RequestHandler = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    reqErrors.notFound(res, `getUser UserId "${req.params.id}" not found.`);
  } else {
    res.send(user);
  }
};
