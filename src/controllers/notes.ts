import { RequestHandler, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { Note, validate } from '../models/note';
import { UserRequest } from '../models/user';
import * as reqErrors from '../util/requestErrors';

export const createNote: RequestHandler = async (req: UserRequest, res: Response) => {
  const values = {
    userId: req.user!,
    content: req.body.content,
    attachment: req.body.attachment,
    createdAt: new Date().getTime(),
  };

  const error = validate(values);

  if (error) {
    reqErrors.badRequest(res, 'createNote failed validation: ', error!);
  } else {
    const note = await Note.create(values);
    res.status(HttpStatus.CREATED).send(note);
  }
};

export const getNotes: RequestHandler = async (req, res, next) => {
  const notes = await Note.find();
  res.send(notes);
};

export const updateNote: RequestHandler = async (req: UserRequest, res: Response) => {
  const values = {
    userId: req.user!,
    content: req.body.content,
    attachment: req.body.attachment,
  };

  const error = validate(values);
  if (error) {
    return reqErrors.badRequest(res, 'updateNote failed validation: ', error);
  }

  const note = await Note.findByIdAndUpdate(req.params.id, values, { new: true });
  if (!note) {
    reqErrors.notFound(res, `updateNote noteId "${req.params.id}" not found.`);
  } else {
    res.send(note);
  }
};

export const deleteNote: RequestHandler = async (req, res) => {
  let note = await Note.findByIdAndDelete(req.params.id);

  if (!note) {
    reqErrors.notFound(res, `deleteNote noteId "${req.params.id}" not found.`);
  } else {
    res.send(note);
  }
};

export const getNote: RequestHandler = async (req, res) => {
  const note = await Note.findById(req.params.id).populate('userId');

  if (!note) {
    reqErrors.notFound(res, `getNote noteId "${req.params.id}" not found.`);
  } else {
    res.send(note);
  }
};
