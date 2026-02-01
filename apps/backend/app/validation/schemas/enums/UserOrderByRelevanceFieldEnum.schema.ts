import * as z from 'zod';

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['index', 'email', 'firstName', 'lastName', 'parentName', 'address', 'phoneNumber', 'password'])

export type UserOrderByRelevanceFieldEnum = z.infer<typeof UserOrderByRelevanceFieldEnumSchema>;