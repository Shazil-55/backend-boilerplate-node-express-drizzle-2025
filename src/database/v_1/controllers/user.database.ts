/* eslint-disable @typescript-eslint/no-explicit-any */
//
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { Entities } from '../../../helpers';
import { AppError } from '../../../helpers/errors';
import { Logger } from '../../../helpers/logger';
import { DatabaseErrors } from '../../../helpers/contants';
import { users } from '../schema';
import * as Validations from '../../../api/v_1/internal/models/auth.model';

export class UserDatabase {
  private logger: typeof Logger;
  private db: ReturnType<typeof drizzle>;

  public constructor(args: { db: ReturnType<typeof drizzle> }) {
    this.logger = Logger;
    this.db = args.db;
  }

  async CreateUser(user: Validations.InsertUser): Promise<string> {
    this.logger.info('Db.CreateUser', { user });

    try {
      const [result] = await this.db.insert(users).values(user).returning({ id: users.id });

      if (!result) {
        this.logger.info('Db.CreateUser User not created');
        throw new AppError(400, 'User not created');
      }

      return result.id;
    } catch (err: any) {
      if (err.code === DatabaseErrors.DUPLICATE) {
        this.logger.error('Db.CreateUser failed due to duplicate key', err);
        throw new AppError(400, 'User with same email already exist');
      }
      if (err instanceof Error) {
        throw new AppError(400, err.message);
      }
      throw new AppError(400, 'User not created');
    }
  }

  async GetUserByEmail(email: string): Promise<Validations.SelectUser | undefined> {
    this.logger.info('Db.GetUserByEmail', { email });

    try {
      const [user] = await this.db.select().from(users).where(eq(users.email, email));

      if (!user) {
        this.logger.info('Db.GetUserByEmail User not found');
        return undefined;
      }

      return user;
    } catch (err) {
      this.logger.error('Db.GetUserByEmail failed', err);
      throw new AppError(400, 'User not found');
    }
  }

  async GetUser(where: Partial<Validations.SelectUser>): Promise<Validations.SelectUser | undefined> {
    this.logger.info('Db.GetUser', { where });

    try {
      const conditions = [];
      if (where.id) conditions.push(eq(users.id, where.id));
      if (where.email) conditions.push(eq(users.email, where.email));
      if (where.type) conditions.push(eq(users.type, where.type));
      if (where.status) conditions.push(eq(users.status, where.status));

      const [user] = await this.db
        .select()
        .from(users)
        .where(and(...conditions));

      if (!user) {
        this.logger.info('Db.GetUser User not found');
        return undefined;
      }

      return user;
    } catch (err) {
      this.logger.error('Db.GetUser failed', err);
      throw new AppError(400, 'User not found');
    }
  }
}
