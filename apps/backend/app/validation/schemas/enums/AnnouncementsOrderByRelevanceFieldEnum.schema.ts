import * as z from 'zod';

export const AnnouncementsOrderByRelevanceFieldEnumSchema = z.enum(['title', 'description'])

export type AnnouncementsOrderByRelevanceFieldEnum = z.infer<typeof AnnouncementsOrderByRelevanceFieldEnumSchema>;