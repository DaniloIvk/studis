import z from 'zod';
import type {
	FormContract,
	FormFieldContract,
} from '../../../types/Form/Form.ts';
import ValidationUtils from '../../Utils.ts';
import Role from '../../../enums/Role.ts';
import type { RoleEnum } from '../../../schema/types.ts';

const className = 'col-span-12 sm:col-span-6';

export function getUserSchema(role: RoleEnum): z.ZodReadonly {
	let schema: Record<string, z.ZodType> = {
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
	};

	if (role === Role.ADMIN.value) {
		delete schema.index;
		delete schema.parentName;
		delete schema.address;
		delete schema.phoneNumber;
	} else if (role === Role.PROFESSOR.value) {
		delete schema.index;
		delete schema.parentName;
		delete schema.address;
	}

	return z
		.object(schema)
		.refine(
			(userData) => userData['password'] === userData['passwordConfirmation'],
		)
		.readonly();
}

export function getFormConfig(role: RoleEnum): FormContract {
	const schema = getUserSchema(role);

	const fields: Record<string, FormFieldContract> = {
		role: {
			type: 'enumDropdown',
			name: 'role',
			label: 'models.role',
			Enum: Role,
			className,
			readOnly: true,
		},
		index: {
			type: 'text',
			name: 'index',
			label: 'models.index',
			minLength: 2,
			maxLength: 255,
			className,
		},
		firstName: {
			type: 'text',
			name: 'firstName',
			label: 'models.first_name',
			minLength: 6,
			maxLength: 230,
			className,
		},
		lastName: {
			type: 'text',
			name: 'lastName',
			label: 'models.last_name',
			minLength: 2,
			maxLength: 255,
			className,
		},
		parentName: {
			type: 'text',
			name: 'parentName',
			label: 'models.parent_name',
			minLength: 2,
			maxLength: 255,
			className,
		},
		phoneNumber: {
			type: 'text',
			name: 'phoneNumber',
			label: 'models.phone_number',
			minLength: 6,
			maxLength: 32,
			className,
		},
		address: {
			type: 'text',
			name: 'address',
			label: 'models.address',
			minLength: 2,
			maxLength: 255,
			className,
		},
		email: {
			type: 'email',
			name: 'email',
			label: 'models.email',
			minLength: 6,
			maxLength: 2320,
			className,
		},
		password: {
			type: 'masked',
			name: 'password',
			label: 'models.password',
			minLength: 6,
			maxLength: 128,
			className,
		},
		passwordConfirmation: {
			type: 'masked',
			name: 'passwordConfirmation',
			label: 'models.password_confirmation',
			minLength: 6,
			maxLength: 128,
			className,
		},
	};

	if (role === Role.ADMIN.value) {
		delete fields.index;
		delete fields.parentName;
		delete fields.address;
		delete fields.phoneNumber;
	} else if (role === Role.PROFESSOR.value) {
		delete fields.index;
		delete fields.address;
	}

	return { schema, fields: Object.values(fields) };
}
