import * as z from 'zod';

export const PersonalAccessTokenScalarFieldEnumSchema = z.enum(['id', 'userId', 'token', 'lastUsedAt', 'expiresAt', 'createdAt', 'updatedAt'])

export type PersonalAccessTokenScalarFieldEnum = z.infer<typeof PersonalAccessTokenScalarFieldEnumSchema>;