import * as z from 'zod';

export const AnnouncementsScalarFieldEnumSchema = z.enum(['id', 'authorId', 'title', 'description', 'createdAt', 'updatedAt'])

export type AnnouncementsScalarFieldEnum = z.infer<typeof AnnouncementsScalarFieldEnumSchema>;