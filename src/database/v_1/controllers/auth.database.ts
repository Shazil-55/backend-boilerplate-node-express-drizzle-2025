/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, gt, and } from 'drizzle-orm';
import { AppError } from '../../../helpers/errors';
import { Logger } from '../../../helpers/logger';
import { DatabaseErrors } from '../../../helpers/contants';
import { users, verifyTokens } from '../schema';
import * as AuthModels from '../../../api/v_1/internal/models/auth.model';

export class AuthDatabase {
  private logger: typeof Logger;
  private db: ReturnType<typeof drizzle>;

  public constructor(args: { db: ReturnType<typeof drizzle> }) {
    this.logger = Logger;
    this.db = args.db;
  }

  async CreateUser(user: AuthModels.InsertUser): Promise<string | undefined> {
    this.logger.info('Db.CreateUser', { user });

    try {
      // Validate the input

      const [result] = await this.db.insert(users).values(user).returning({ id: users.id });

      if (!result) {
        this.logger.info('Db.CreateUser User not created');
        throw new AppError(400, 'User not created');
      }

      return result.id;
    } catch (err: any) {
      if (err.code === DatabaseErrors.DUPLICATE) {
        this.logger.error('Db.CreateUser failed due to duplicate key', err);
        throw new AppError(400, 'User already exists');
      }
      if (err instanceof Error) {
        throw new AppError(400, err.message);
      }
      throw new AppError(400, `User not created ${err}`);
    }
  }

  async DeleteSession(where: Partial<AuthModels.SelectVerifyToken>): Promise<void> {
    this.logger.info('Db.DeleteSession', { where });

    try {
      const conditions = [];
      if (where.id) conditions.push(eq(verifyTokens.id, where.id));
      if (where.userId) conditions.push(eq(verifyTokens.userId, where.userId));
      if (where.token) conditions.push(eq(verifyTokens.token, where.token));

      await this.db.delete(verifyTokens).where(and(...conditions));
    } catch (err) {
      this.logger.error('Db.verifySession Error deleting session', err);
      throw new AppError(500, 'Error deleting verifySession');
    }
  }

  async GetSession(where: Partial<AuthModels.SelectVerifyToken>): Promise<AuthModels.SelectVerifyToken | undefined> {
    this.logger.info('Db.GetSession', { where });

    const OneMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
      const conditions = [];
      if (where.id) conditions.push(eq(verifyTokens.id, where.id));
      if (where.userId) conditions.push(eq(verifyTokens.userId, where.userId));
      if (where.token) conditions.push(eq(verifyTokens.token, where.token));
      conditions.push(gt(verifyTokens.createdAt, OneMinuteAgo));

      const [session] = await this.db
        .select()
        .from(verifyTokens)
        .where(and(...conditions));

      if (!session) {
        this.logger.info('Db.verifySession No valid session found');
        return undefined;
      }

      // Validate the output
      return session;
    } catch (err) {
      this.logger.error('Db.verifySession Error getting session', err);
      return undefined;
    }
  }

  async StoreSessionToken(data: AuthModels.InsertVerifyToken): Promise<void> {
    this.logger.info('Db.StoreSessionToken', { data });

    try {
      await this.db.insert(verifyTokens).values(data);
    } catch (err) {
      if (err instanceof Error) {
        throw new AppError(400, err.message);
      }
      throw new AppError(400, `Token not stored`);
    }
  }
}
