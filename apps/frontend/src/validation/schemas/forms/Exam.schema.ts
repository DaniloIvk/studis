import z from 'zod';
import type { FormContract } from '../../../types/Form/Form';
import CourseService from '../../../services/CourseService';
import ValidationUtils from '../../Utils';

export const ExamSchema = z
	.object({
		courseId: z
			.preprocess(
				ValidationUtils.convertValueToNumber,
				z.number().min(1).readonly(),
			)
			.readonly(),
		title: z.string().min(1).max(255).readonly(),
		description: z.string().optional().readonly(),
		date: z.string().min(1).readonly(),
	})
	.readonly();

export type ExamFormType = z.infer<typeof ExamSchema>;

const className = 'col-span-12 sm:col-span-6';

export const formConfig: FormContract<CourseService> = {
	schema: ExamSchema,
	fields: [
		{
			type: 'dropdown',
			name: 'courseId',
			label: 'models.course',
			labelKey: 'name',
			apiResponseDataOptions: {
				ApiService: CourseService,
				apiRoute: 'getAll',
			},
			className,
		},
		{
			type: 'text',
			name: 'title',
			label: 'models.exam_title',
			className,
		},
		{
			type: 'text',
			name: 'description',
			label: 'models.exam_description',
			className: 'col-span-12',
		},
		{
			type: 'datePicker',
			name: 'date',
			label: 'models.exam_date',
			className,
		},
	],
};