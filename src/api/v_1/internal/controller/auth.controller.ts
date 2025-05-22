import * as express from 'express';
import { Response } from 'express';
import { Db } from '../../../../database/db';
import { Logger } from '../../../../helpers/logger';
import { genericError, RequestBody, RequestQuery } from '../../../../helpers/utils';
import { AppError } from '../../../../helpers/errors';
import * as AuthModel from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { getGoogleAuthUrl } from '../../../../helpers/googleAuth';
import { FrontEndLink } from '../../../../helpers/contants';

export class AuthController {
  public router: express.Router;

  constructor() {
    Logger.info('Auth controller initialized...');

    this.router = express.Router();

    this.AuthRouter();
  }

  private AuthRouter(): void {
    this.router.post('/register', async (req: RequestBody<AuthModel.InsertUser>, res: Response) => {
      let body;
      try {
        await AuthModel.UserRegistrationSchema.parseAsync(req.body);
        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        const response = await service.CreateUser(req.body);

        body = {
          data: response,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.post('/login', async (req: RequestBody<{ email: string; password: string }>, res: Response) => {
      let body;
      try {
        await AuthModel.LoginSchema.parseAsync(req.body);
        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        const response = await service.Login(req.body.email, req.body.password);
        body = {
          data: response,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.post('/send-email', async (req: RequestBody<{ email: string }>, res: Response) => {
      let body;
      try {
        await AuthModel.RequestOTPSchema.parseAsync(req.body);
        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        const response = await service.SendOtp(req.body.email);
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.post('/reset-password', async (req: RequestBody<AuthModel.RecoverPassword>, res: Response) => {
      let body;
      try {
        await AuthModel.RecoverPasswordSchema.parseAsync(req.body);
        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        await service.VerifyAndUpdate(req.body.sessionToken, req.body.password);
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.get('/google/url', (req, res) => {
      const authUrl = getGoogleAuthUrl();
      res.json({ data: { url: authUrl } });
    });

    this.router.get('/google/callback', async (req: RequestQuery<{ code: string }>, res: Response) => {
      try {
        const { code } = req.query;

        if (!code) {
          throw new AppError(400, 'Authorization code is required');
        }

        const db = res.locals.db as Db;
        const service = new AuthService({ db });

        // Exchange code for tokens and get user info
        const tokens = await service.GoogleLogin(code as string);

        res.redirect(
          `${FrontEndLink}/auth/google/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
        );
      } catch (error) {
        genericError(error, res);
      }
    });

    this.router.post(
      '/login/refresh-token',
      async (req: RequestBody<AuthModel.LoginWithRefreshToken>, res: Response) => {
        let body;
        try {
          await AuthModel.LoginWithRefreshTokenSchema.parseAsync(req.body);
          const db = res.locals.db as Db;

          const service = new AuthService({ db });

          const response = await service.ValidateRefreshToken(req.body.refreshToken);

          body = {
            data: response,
          };
        } catch (error) {
          genericError(error, res);
        }
        res.json(body);
      },
    );

    this.router.post('/admin/login', async (req: RequestBody<{ email: string; password: string }>, res: Response) => {
      let body;
      try {
        await AuthModel.LoginSchema.parseAsync(req.body);
        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        const response = await service.GetLoginAdmin(req.body);

        body = {
          data: response,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
  }
}
