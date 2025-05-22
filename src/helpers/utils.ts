import { Request, Response } from 'express';
import { Query } from 'express-serve-static-core';
import { AppError } from './errors';
import { Logger } from './logger';
import { ZodError } from 'zod'; // Import ZodError

export interface RequestBody<T> extends Request {
  body: T;
}

export interface RequestQuery<T extends Query> extends Request {
  query: T;
}

export const genericError = (error: unknown, res: Response) => {
  Logger.error('Api Error', error);

  if (error instanceof AppError) {
    const appError = error as AppError;
    res.statusCode = appError.statusCode;
    return res.json({ error: appError.message, name: appError.name });
  } else if (error instanceof ZodError) {
    // Check for Zod validation error
    res.statusCode = 400;
    return res.json({ error: 'Validation Error', exception: error });
  } else {
    res.statusCode = 500;
    return res.json({ error: 'Something broke on the server', name: 'server error' });
  }
};
