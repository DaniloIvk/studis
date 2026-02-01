import * as z from 'zod';

export const CodeSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  value: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CodeType = z.infer<typeof CodeSchema>;
