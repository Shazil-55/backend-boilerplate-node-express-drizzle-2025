/* eslint-disable */
import dotenv from 'dotenv';
const result = dotenv.config();

import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ENV } from '../helpers/env';
import { Logger } from '../helpers/logger';
import * as schema from './v_1/schema';

(async () => {
  await runMigrations();
})();

async function runMigrations() {
  let pool: Pool | undefined;

  try {
    Logger.info('Starting database migrations...');

    pool = new Pool({
      host: ENV.Database.MIGRATOR_DB_HOST,
      user: ENV.Database.DB_USER,
      database: ENV.Database.DB_NAME,
      password: ENV.Database.DB_PASSWORD,
    });

    const db = drizzle(pool, { schema });

    Logger.debug('Running migrations from drizzle folder');
    await migrate(db, { migrationsFolder: 'drizzle' });
    Logger.info('✅ Migrations completed successfully');
  } catch (error) {
    Logger.error('❌ Migration failed', error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      pool = undefined;
    }
  }
}
