import { z } from 'zod';
import { UserTypes } from '../../../../helpers/entities';

export const CreateUserBodySchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  companyId: z.string().optional(),
  profilePhoto: z.string(),
  type: z.enum([UserTypes.User, UserTypes.Admin]),
});

export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;

export const UpdateTempPasswordBodySchema = z.object({
  newPassword: z.string(),
});

export type UpdateTempPasswordBody = z.infer<typeof UpdateTempPasswordBodySchema>;

export const UpdateUserBodySchema = z.object({
  userName: z.string().optional(),
  email: z.string().email().optional(),
  companyId: z.string().optional(),
  profilePhoto: z.string().optional(),
  type: z.enum([UserTypes.User, UserTypes.Admin]).optional(),
});

export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
