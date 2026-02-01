import * as z from 'zod';
import { RoleSchema } from '../enums/Role.schema';

export const UserSchema = z.object({
  id: z.number().int(),
  role: RoleSchema.default("STUDENT"),
  index: z.string().nullish(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  parentName: z.string().nullish(),
  address: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  password: z.string(),
  emailVerifiedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
