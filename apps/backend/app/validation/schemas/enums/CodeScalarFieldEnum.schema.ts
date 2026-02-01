import * as z from 'zod';

export const CodeScalarFieldEnumSchema = z.enum(['id', 'userId', 'value', 'createdAt', 'updatedAt'])

export type CodeScalarFieldEnum = z.infer<typeof CodeScalarFieldEnumSchema>;