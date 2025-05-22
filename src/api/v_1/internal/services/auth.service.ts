import { Db } from '../../../../database/db';
import { AppError } from '../../../../helpers/errors';
import { Logger } from '../../../../helpers/logger';
import { Entities, Hash } from '../../../../helpers';
import * as Token from '../../../../helpers/token';
import { generateOTP, generateRandomToken } from '../../../../helpers/otp';
import { EmailService } from '../../../../helpers/email';
import * as AuthModel from '../models/auth.model';
import { hashPassword } from '../../../../helpers/hash';
import { GoogleUserInfo, handleGoogleCallback } from '../../../../helpers/googleAuth';
import { UserTypes } from '../../../../helpers/entities';

export class AuthService {
  private db: Db;
  private emailService: EmailService;

  constructor(args: { db: Db }) {
    Logger.info('AuthService initialized...');
    this.db = args.db;
    this.emailService = new EmailService();
  }

  public async GoogleLogin(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    Logger.info('AuthService.GoogleLogin');

    try {
      Logger.info('========');

      const googleUser = await handleGoogleCallback(code);
      Logger.info('AuthService.GoogleUserData', { googleUser });
      if (!googleUser) {
        throw new AppError(400, 'Failed to verify Google token');
      }

      // Check if user exists
      let user = await this.db.v1.User.GetUserByEmail(googleUser.email);

      if (!user) {
        // Create new user if doesn't exist
        Logger.info('3333333');
        const newUser = {
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
          profileImage: googleUser.picture,
          socialLogin: true,
          role: UserTypes.User,
        };
        Logger.info('4444444');
        const userId = await this.db.v1.Auth.CreateUser(newUser);
        if (!userId) {
          throw new AppError(500, 'Failed to create user');
        }

        user = await this.db.v1.User.GetUserByEmail(googleUser.email);
      }

      if (!user) {
        throw new AppError(500, 'User not found');
      }

      // Generate our app tokens
      const dataForToken = { id: user.id };
      const accessToken = Token.createAccessToken(dataForToken);
      const refreshToken = Token.createRefreshToken(dataForToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      Logger.error('Google callback error:', error);
      throw new AppError(500, 'Failed to process Google authentication');
    }
  }

  async CreateUser(data: AuthModel.InsertUser): Promise<AuthModel.Tokens | undefined> {
    Logger.info('AuthService.CreateUser', { data });

    let password = await hashPassword(data.password);
    data.password = password;

    const { confirmPassword, ...userData } = data;

    const user = await this.db.v1.Auth.CreateUser(userData);
    if (!user) return undefined;

    const dataForToken = { id: user };

    const accessToken = Token.createAccessToken(dataForToken);
    const refreshToken = Token.createRefreshToken(dataForToken);

    const token: AuthModel.Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return token;
  }

  async Login(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    Logger.info('AuthService.CheckLoginOtp', { email, password });

    const fetchedUser = await this.db.v1.User.GetUserByEmail(email);

    if (!fetchedUser) throw new AppError(400, 'User not found');

    if (!fetchedUser.password) throw new AppError(500, 'No password found for user');

    const isCorrectPassword = await Hash.verifyPassword(password, fetchedUser.password);

    if (!isCorrectPassword) throw new AppError(400, 'Invalid credentials');

    const accessToken = Token.createAccessToken({ id: fetchedUser.id });
    const refreshToken = Token.createRefreshToken({ id: fetchedUser.id });

    const token: AuthModel.Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return token;
  }

  async SendOtp(email: string): Promise<void> {
    Logger.info('AuthService.SendOtp', { email });

    const fetchedUser = await this.db.v1.User.GetUserByEmail(email);

    if (!fetchedUser) throw new AppError(400, 'User does not exist');

    const sessionToken = generateRandomToken();
    await this.db.v1.Auth.StoreSessionToken({ userId: fetchedUser.id, sessionToken: sessionToken });

    await this.emailService.SendMail(email, sessionToken);
  }

  async VerifyAndUpdate(sessionToken: string, password: string): Promise<void> {
    Logger.info('AuthService.SendOtp', { sessionToken });

    const fetchedSession = await this.db.v1.Auth.GetSession({ sessionToken });

    if (!fetchedSession) throw new AppError(400, 'No Session Exist');

    await this.db.v1.Auth.DeleteSession({ sessionToken });

    let hashedPassword = await hashPassword(password);

    // await this.db.v1.User.UpdateUser({ id: fetchedSession.userId }, { password: hashedPassword });
  }

  async ValidateRefreshToken(refreshToken: string): Promise<AuthModel.Tokens> {
    Logger.info('AuthService.ValidateRefreshToken', { refreshToken });

    const data = Token.verifyRefreshToken(refreshToken);

    Logger.info('AuthService.ValidateRefreshToken', { data });

    if (!data?.id) {
      throw new AppError(400, 'Invalid refresh token');
    }

    const fetchedUser = await this.db.v1.User.GetUser({ id: data.id });

    if (!fetchedUser) throw new AppError(400, 'User not found');

    const dataForToken = { id: data.id };

    const accessToken = Token.createAccessToken(dataForToken);
    const newRefreshToken = Token.createRefreshToken(dataForToken);

    const token: AuthModel.Tokens = {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };

    return token;
  }

  public async GetLoginAdmin(admin: AuthModel.LoginBody): Promise<AuthModel.Tokens> {
    Logger.info('AuthService.GetLoginAdmin', { admin });

    const fetchedUser = await this.db.v1.User.GetUserByEmail(admin.email);

    if (!fetchedUser) throw new AppError(400, 'Admin not found');

    if (!fetchedUser.password) throw new AppError(500, 'No password found for admin');

    const isCorrectPassword = await Hash.verifyPassword(admin.password, fetchedUser.password);

    if (!isCorrectPassword) throw new AppError(400, 'Invalid credentials');

    const dataForToken = { adminId: fetchedUser.id!, types: JSON.stringify('Admin') };

    const accessToken = Token.createAccessToken(dataForToken);

    const refreshToken = Token.createRefreshToken(dataForToken);

    const token: AuthModel.Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return token;
  }
}
