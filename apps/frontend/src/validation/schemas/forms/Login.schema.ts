import z from 'zod';
import ValidationUtils from '../../Utils';
import type { FormContract } from '../../../types/Form/Form';
import Logo from '../../../assets/images/Logo.png';

const LoginSchema = z
	.preprocess(
		ValidationUtils.preprocessStringInputValue,
		z
			.object({
				email: z.email().min(6).max(320).readonly(),
				password: z.string().min(6).max(128).readonly(),
			})
			.partial()
			.readonly(),
	)
	.readonly();

export type LoginFormType = z.infer<typeof LoginSchema>;

export default LoginSchema;

export const formConfig: FormContract = {
	schema: LoginSchema,
	fields: [
		{
			type: 'email',
			name: 'email',
			label: 'email',
			autoComplete: 'username',
			minLength: 6,
			maxLength: 320,
		},
		{
			type: 'masked',
			name: 'password',
			label: 'password',
			autoComplete: 'current-password',
			minLength: 8,
			maxLength: 128,
		},
	],
	featuredImage: { src: Logo, className: 'col-start-4 col-span-6' },
};
