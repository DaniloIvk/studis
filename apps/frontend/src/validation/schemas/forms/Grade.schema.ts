import z from 'zod';
import type { FormContract } from '../../../types/Form/Form';
import UserService from '../../../services/UserService';
import ExamService from '../../../services/ExamService';
import ValidationUtils from '../../Utils';

export const GradeSchema = z
	.object({
		studentId: z
			.preprocess(
				ValidationUtils.convertValueToNumber,
				z.number().min(1).readonly(),
			)
			.readonly(),
		examId: z
			.preprocess(
				ValidationUtils.convertValueToNumber,
				z.number().min(1).readonly(),
			)
			.readonly(),
		value: z
			.preprocess(
				ValidationUtils.convertValueToNumber,
				z.number().min(5).max(10).readonly(),
			)
			.readonly(),
	})
	.readonly();

export type GradeFormType = z.infer<typeof GradeSchema>;

const className = 'col-span-12 sm:col-span-6';

export const formConfig: FormContract<any> = {
	schema: GradeSchema,
	fields: [
		{
			type: 'dropdown',
			name: 'studentId',
			label: 'models.student',
			labelKey: 'fullName',
			apiResponseDataOptions: {
				ApiService: UserService,
				apiRoute: 'getAllStudents', // You may need to add this method
			},
			className,
		},
		{
			type: 'dropdown',
			name: 'examId',
			label: 'models.exam',
			labelKey: 'title',
			apiResponseDataOptions: {
				ApiService: ExamService,
				apiRoute: 'getAll',
			},
			className,
		},
		{
			type: 'number',
			name: 'value',
			label: 'models.grade',
			min: 5,
			max: 10,
			step: 0.5,
			className,
		},
	],
};