import z from 'zod';
import type { FormContract } from '../../../types/Form/Form';
import ValidationUtils from '../../Utils';
import CourseService from '../../../services/CourseService';

const CourseMaterialSchema = z.object({
	courseId: z.preprocess(
		ValidationUtils.convertValueToNumber,
		z.number().min(1).readonly(),
	),
	title: z.string().min(2).max(255).readonly(),
	description: z
		.preprocess(
			ValidationUtils.convertEmptyInputToUndefined,
			z.string().max(5000).nullish().readonly(),
		)
		.readonly(),
	file: z.any().nullish().optional(),
});

const className = 'col-span-12 sm:col-span-6';

export const formConfig: FormContract<CourseService> = {
	schema: CourseMaterialSchema,
	fields: [
		{
			type: 'text',
			name: 'title',
			label: 'models.title',
			minLength: 2,
			maxLength: 255,
			className,
		},
		{
			type: 'dropdown',
			name: 'courseId',
			label: 'models.course',
			apiResponseDataOptions: {
				ApiService: CourseService,
				apiRoute: 'getAllWithoutPagination',
			},
			className,
		},
		{
			type: 'text',
			name: 'description',
			label: 'models.description',
			maxLength: 5000,
			className,
		},
		{
			type: 'fileUpload',
			name: 'file',
			label: 'models.file',
			filenameField: 'filename',
			filepathField: 'filepath',
			className,
		},
	],
};
