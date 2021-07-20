import { Response } from 'express';
import Joi from 'joi';
import HttpStatus from 'http-status-codes';

export const errorsToArray = (error: Joi.ValidationError) => {
  const errors: string[] = [];
  error.details.map((detail) => {
    errors.push(detail.message);
  });
  return errors;
};

export const badRequest = (res: Response, message: string, error: Joi.ValidationError) => {
  const errors: string[] = errorsToArray(error);
  logger.info(message + errors);
  res.status(HttpStatus.BAD_REQUEST).json({ errors });
};

export const notFound = (res: Response, message: string) => {
  logger.info(message);
  res.status(HttpStatus.NOT_FOUND).send(message);
};

export const serverError = (res: Response, message: string) => {
  logger.error(message);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
};
