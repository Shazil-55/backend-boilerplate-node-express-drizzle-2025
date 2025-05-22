import * as express from 'express';
import { Response, Request } from 'express';
import { Db } from '../../../../database/db';
import { Logger } from '../../../../helpers/logger';
import { genericError, RequestBody, RequestQuery } from '../../../../helpers/utils';
import { UserService } from '../services/user.service';
import { Entities, Hash } from '../../../../helpers';
import { jwtAuth } from '../middlewares/api-auth';

export class UserController {
  public router: express.Router;

  constructor() {
    Logger.info('User controller initialized...');
    this.router = express.Router();
    this.UserRouter();
  }

  private UserRouter(): void {
    this.router.get(
      '/',
      (req, res, next) => {
        jwtAuth(req, res, next, [], true);
      },
      async (req: Request, res: Response) => {
        let body;
        try {
          const db = res.locals.db as Db;
          const service = new UserService({ db });
          const userId = req.userId;
          const response = await service.GetUserById(userId);

          body = {
            data: response,
          };
        } catch (error) {
          genericError(error, res);
        }
        res.json(body);
      },
    );
  }
}
