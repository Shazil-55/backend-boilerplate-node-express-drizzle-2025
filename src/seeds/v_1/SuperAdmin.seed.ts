import { Db } from '../../database/db';
import { User, UserStatus, UserTypes } from '../../helpers/entities';
import { Logger } from '../../helpers/logger';
import { hashPassword } from '../../helpers/hash';

const user: Partial<User> = {
  email: 'admin@boilerplate.com',
  password: 'admin',
  type: UserTypes.Admin,
  firstName: 'Admin',
  lastName: 'Boilerplate',
  profilePhoto:
    'https://d2j141hl2t6y7e.cloudfront.net/profile-pictures/1729688528098-Screenshot_2024-10-23_at_6.01.51 PM.png',
  status: UserStatus.Active,
};

export async function superCompanyAndAdminSeed(db: Db) {
  Logger.info('Running super admin...');

  try {
    if (!user.email || !user.password) throw new Error('Email and Password are required');

    const userExists = await db.v1.User.GetUserByEmail(user.email);

    if (userExists) {
      Logger.info('Super admin already exists');
    } else {
      Logger.info('Creating super admin...');

      const hashedPassword = await hashPassword(user.password);

      user.password = hashedPassword;

      await db.v1.User.CreateUser(user);
    }
  } catch (error) {
    Logger.error('Error running super admin seed', error);
  }
}
