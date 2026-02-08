// import { z } from 'zod';

// export const ExamSchema = z.object({
//   courseId: z.number({ required_error: 'Course is required' }),
//   title: z.string().min(1, 'Title is required').max(255),
//   description: z.string().optional(),
//   date: z.string({ required_error: 'Date is required' })
// });

// export type ExamFormType = z.infer<typeof ExamSchema>;

// export const formConfig = {
//   schema: ExamSchema,
//   fields: [
//     {
//       name: 'courseId',
//       label: 'Course',
//       type: 'dropdown' as const,
//       // You'll need to provide course options
//     },
//     {
//       name: 'title',
//       label: 'Title',
//       type: 'text' as const,
//     },
//     {
//       name: 'description',
//       label: 'Description',
//       type: 'text' as const,
//     },
//     {
//       name: 'date',
//       label: 'Date',
//       type: 'datetime-local' as const,
//     },
//   ],
// };