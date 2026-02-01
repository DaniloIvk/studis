import z from 'zod';
import type { FormContract } from '../../../types/Form/Form.ts';
import ValidationUtils from '../../Utils.ts';
import Role from '../../../enums/Role.ts';

export const UserSchema = z
	.object({
		role: z.enum(Role.values()).nullish().readonly(),
		index: z.string().min(2).max(255).nullish().readonly(),
		email: z.email().min(6).max(320).readonly(),
		firstName: z.string().min(2).max(255).readonly(),
		lastName: z.string().min(2).max(255).nullish().readonly(),
		parentName: z.string().min(2).max(255).nullish().readonly(),
		address: z.string().min(2).max(255).nullish().readonly(),
		phoneNumber: z.string().min(6).max(32).nullish().readonly(),
		password: z.preprocess(
			ValidationUtils.convertEmptyInputToUndefined,
			z.string().min(8).max(128).optional().readonly(),
		),
		passwordConfirmation: z.preprocess(
			ValidationUtils.convertEmptyInputToUndefined,
			z.string().min(8).max(128).optional().readonly(),
		),
	})
	.refine(
		(userData) => userData['password'] === userData['passwordConfirmation'],
	)
	.readonly();

const className = 'col-span-12 sm:col-span-6';

export const formConfig: FormContract = {
	schema: UserSchema,
	fields: [
		{
			type: 'enumDropdown',
			name: 'role',
			label: 'models.role',
			Enum: Role,
			className,
		},
		{
			type: 'text',
			name: 'index',
			label: 'models.index',
			minLength: 2,
			maxLength: 255,
			className,
		},
		{
			type: 'text',
			name: 'firstName',
			label: 'models.first_name',
			minLength: 6,
			maxLength: 230,
			className,
		},
		{
			type: 'text',
			name: 'lastName',
			label: 'models.last_name',
			minLength: 2,
			maxLength: 255,
			className,
		},
		{
			type: 'text',
			name: 'parentName',
			label: 'models.parent_name',
			minLength: 2,
			maxLength: 255,
			className,
		},
		{
			type: 'text',
			name: 'phoneNumber',
			label: 'models.phone_number',
			minLength: 6,
			maxLength: 32,
			className,
		},
		{
			type: 'text',
			name: 'address',
			label: 'models.address',
			minLength: 2,
			maxLength: 255,
			className,
		},
		{
			type: 'email',
			name: 'email',
			label: 'models.email',
			minLength: 6,
			maxLength: 2320,
			className,
		},
		{
			type: 'masked',
			name: 'password',
			label: 'models.password',
			minLength: 8,
			maxLength: 128,
			className,
		},
		{
			type: 'masked',
			name: 'passwordConfirmation',
			label: 'models.password_confirmation',
			minLength: 8,
			maxLength: 128,
			className,
		},
	],
};
