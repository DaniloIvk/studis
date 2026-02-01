import * as z from 'zod';

export const RoleSchema = z.enum(['ADMIN', 'PROFESSOR', 'STUDENT'])

export type Role = z.infer<typeof RoleSchema>;