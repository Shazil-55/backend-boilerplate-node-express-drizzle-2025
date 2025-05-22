import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { UserTypes, UserStatus } from '../../helpers/entities';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).$type<UserTypes>().notNull(),
  status: varchar('status', { length: 50 }).$type<UserStatus>().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  profilePhoto: varchar('profilePhoto', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const verifyTokens = pgTable('verifyTokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: text('token').notNull(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const verifyTokens2 = pgTable('verifyTokens2', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: text('token').notNull(),
  token2: text('token2').notNull(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});
