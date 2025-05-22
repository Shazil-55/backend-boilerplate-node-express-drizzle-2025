import * as express from 'express';
import cors from 'cors';
import { Logger } from '../../../../helpers/logger';
import { CommonController } from './common.controller';
import { internalOptions } from '../../../../helpers/cors';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

import fileUpload from 'express-fileupload';

export class ApiController {
  public router: express.Router;

  constructor() {
    Logger.info('Initializing API Routes');
    this.router = express.Router();
    this.InitMiddleWares();
    this.InitApiRoutes();
    Logger.info('API routes initialize successfully!');
  }

  private InitMiddleWares(): void {
    this.router.use(cors(internalOptions));
    this.router.use(express.json({ limit: '200mb' }));
    this.router.use(fileUpload());
  }

  private InitApiRoutes(): void {
    this.router.use('/common', new CommonController().router);
    this.router.use('/auth', new AuthController().router);

    this.router.use('/user', new UserController().router);

    this.router.use('*', (req: express.Request, res: express.Response): express.Response => {
      try {
        throw `the Endpoint ${req.originalUrl} with the method ${req.method} Is not hosted on our server!`;
      } catch (error) {
        Logger.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    });
  }
}
