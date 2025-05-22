/* eslint-disable */
import dotenv from 'dotenv';
const result = dotenv.config();

import Path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import { ENV } from '../helpers/env';
import { Logger } from '../helpers/logger';

(async () => {
  await cleanUpDatabase();
})();

async function cleanUpDatabase() {
  if (ENV.Server.IS_LOCAL_ENV) {
    Logger.info('Getting ready to cleanup...');
    Logger.info('Connecting database');

    let pool: Pool | undefined;

    try {
      pool = new Pool({
        host: ENV.Database.MIGRATOR_DB_HOST,
        user: ENV.Database.DB_USER,
        database: ENV.Database.DB_NAME,
        password: ENV.Database.DB_PASSWORD,
      });

      const db = drizzle(pool);

      const query = `
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
      `;

      Logger.debug('Executing cleanup query');
      await db.execute(sql.raw(query));
      Logger.info('Database cleaned successfully');
    } catch (e) {
      console.error('Error', e);
      throw e;
    } finally {
      if (pool) {
        await pool.end();
        pool = undefined;
      }
    }
  } else {
    Logger.info('Not in local environment');
  }
}
