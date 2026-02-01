import * as z from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id', 'role', 'index', 'email', 'firstName', 'lastName', 'parentName', 'address', 'phoneNumber', 'password', 'emailVerifiedAt', 'createdAt', 'updatedAt'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;