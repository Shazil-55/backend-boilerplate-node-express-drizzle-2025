//

import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import { Db } from '../../../../database/db';
import { Logger } from '../../../../helpers';
import { UserTypes } from '../../../../helpers/entities';
import { Jwt } from '../../../../helpers/env';

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userTypeToCheck: UserTypes[],
  all = false,
): Promise<void | Response> => {
  try {
    Logger.Logger.info('jwtAuth middleware initialized...');
    const token: string = req.headers['access-token']?.toString() || '';

    if (!token) return res.status(401).json({ Error: true, Msg: 'Unauthorized' });

    const decoded: any = JWT.verify(token, Jwt.JWT_SECRET || '');
    if (decoded.isRefreshToken) return res.status(400).json({ Error: true, Msg: 'User Token Is Invalid or Expired! ' });
    const db = res.locals.db as Db;
    const userData = await db.v1.User.GetUser({ id: decoded.id });

    if (!userData) return res.status(400).json({ Error: true, Msg: 'Invalid token' });

    const Usertype = userData.type;

    if (!all) {
      if (!userTypeToCheck.includes(Usertype)) return res.status(401).json({ Error: true, Msg: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userType = Usertype;

    next();
  } catch (error) {
    Logger.Logger.error(error);
    res.status(400).json({ Error: true, Msg: `User Token Is Invalid or Expired!4` });
  }
};
