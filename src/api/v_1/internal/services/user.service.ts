import { Db } from '../../../../database/db';
import { AppError, BadRequest } from '../../../../helpers/errors';
import { Logger } from '../../../../helpers/logger';
import { Entities, Hash } from '../../../../helpers';
import * as UserModels from '../models/user.model';
import * as AuthModel from '../models/auth.model';
import { User, UserTypes } from '../../../../helpers/entities';
import * as Token from '../../../../helpers/token';
import { generatePassword } from '../../../../helpers/generateRandomPassword';
import { hashPassword } from '../../../../helpers/hash';
import { generateRandomOTP } from '../../../../helpers/generateRandomOTP';
import moment from 'moment';
import { EmailService } from '../../../../helpers/email';

export class UserService {
  private db: Db;
  private emailService: EmailService;

  constructor(args: { db: Db }) {
    Logger.info('UserService initialized...');
    this.db = args.db;
    this.emailService = new EmailService();
  }

  public async GetUserById(userId: string): Promise<Omit<User, 'password'>> {
    Logger.info('UserService.GetUserById', { userId });

    const user = await this.db.v1.User.GetUser({ id: userId });

    if (!user) throw new BadRequest('User not found');
    delete user.password;
    return user;
  }
}
