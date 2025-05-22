import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NodePgClient } from 'drizzle-orm/node-postgres';
import { ENV } from '../helpers/env';
import { Logger } from '../helpers/logger';
import { UserDatabase } from './v_1/controllers/user.database';
import { AuthDatabase } from './v_1/controllers/auth.database';

type DrizzleDb = NodePgDatabase<Record<string, unknown>> & { $client: NodePgClient };

export class Db {
  // eslint-disable-next-line no-use-before-define
  private static instance: Db;

  private logger: typeof Logger;

  private pool: Pool | undefined;

  private drizzleDb: DrizzleDb | undefined;

  public v1: {
    User: UserDatabase;
    Auth: AuthDatabase;
  };

  // public v2: {
  //   User: UserDatabaseV2;
  //   Company: CompanyDatabaseV2;
  //   Project: ProjectDatabaseV2;
  // };

  public constructor() {
    this.logger = Logger;

    const dbArgs = {
      db: this.GetDrizzle(),
    };

    this.v1 = {
      User: new UserDatabase(dbArgs),
      Auth: new AuthDatabase(dbArgs),
    };

    // this.v2 = {
    //   User: new UserDatabaseV2(dbArgs),
    //   Company: new CompanyDatabaseV2(dbArgs),
    //   Project: new ProjectDatabaseV2(dbArgs),
    // };
  }

  public static get Instance(): Db {
    if (!this.instance) {
      this.instance = new Db();
    }

    return this.instance;
  }

  public Init(): void {
    if (!this.pool) {
      this.logger.debug('Connecting to database');
      this.pool = new Pool({
        host: ENV.Database.DB_HOST,
        user: ENV.Database.DB_USER,
        database: ENV.Database.DB_NAME,
        password: ENV.Database.DB_PASSWORD,
      });
      this.drizzleDb = drizzle(this.pool) as DrizzleDb;
    }
  }

  public async DisconnectDb(): Promise<void> {
    try {
      if (this.pool) {
        this.logger.info('Cleaning up database');
        await this.pool.end();
      }
    } catch (e) {
      this.logger.error('Failed to cleanup database', e);
    } finally {
      this.pool = undefined;
      this.drizzleDb = undefined;
    }
  }

  private GetDrizzle(): DrizzleDb {
    this.Init();
    if (!this.drizzleDb) {
      throw new Error('Database not initialized');
    }
    return this.drizzleDb;
  }
}
