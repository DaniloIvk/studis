import * as z from 'zod';

export const PersonalAccessTokenSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  token: z.string(),
  lastUsedAt: z.date(),
  expiresAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PersonalAccessTokenType = z.infer<typeof PersonalAccessTokenSchema>;
