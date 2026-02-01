import z from 'zod';
import type { FormContract } from '../../../types/Form/Form.ts';
import Semester from '../../../enums/Semester.ts';
import UserService from '../../../services/UserService.ts';
import ValidationUtils from '../../Utils.ts';

export const CourseSchema = z
	.object({
		professorId: z
			.preprocess(
				ValidationUtils.convertValueToNumber,
				z.number().min(1).readonly(),
			)
			.readonly(),
		semester: z.enum(Semester.values()).readonly(),
		index: z.string().min(2).max(255).readonly(),
		name: z.string().min(2).max(255).readonly(),
		espb: z
			.preprocess(
				ValidationUtils.convertValueToNumber,
				z.number().min(1).max(60).readonly(),
			)
			.readonly(),
		description: z.string().min(6).max(5000).nullish().readonly(),
	})
	.readonly();

const className = 'col-span-12 sm:col-span-6';

export const formConfig: FormContract<UserService> = {
	schema: CourseSchema,
	fields: [
		{
			type: 'dropdown',
			name: 'professorId',
			label: 'models.professor',
			labelKey: 'fullName',
			apiResponseDataOptions: {
				ApiService: UserService,
				apiRoute: 'getAllProfessors',
			},
			className,
		},
		{
			type: 'enumDropdown',
			name: 'semester',
			label: 'models.semester',
			Enum: Semester,
			className,
		},
		{ type: 'text', name: 'index', label: 'models.index', className },
		{ type: 'text', name: 'name', label: 'models.name', className },
		{
			type: 'number',
			name: 'espb',
			label: 'models.espb',
			min: 1,
			max: 60,
			className,
		},
		{
			type: 'text',
			name: 'description',
			label: 'models.description',
			maxLength: 5000,
			className,
		},
	],
};
