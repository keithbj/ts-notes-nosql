import { Request, Response, NextFunction } from 'express';

const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);

  res.status(500).send(`System Error: ${err.message}`);
};

export default error;
