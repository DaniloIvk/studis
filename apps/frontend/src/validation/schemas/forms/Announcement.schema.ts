import z from 'zod';
import type { FormContract } from '../../../types/Form/Form';

const AnnouncementMaterialSchema = z
	.object({
		title: z.string().min(5).max(255).readonly(),
		description: z.string().min(6).max(5_000).readonly(),
	})
	.readonly();

export const formConfig: FormContract = {
	schema: AnnouncementMaterialSchema,
	fields: [
		{
			type: 'text',
			name: 'title',
			label: 'models.title',
			minLength: 2,
			maxLength: 255,
			className: 'col-span-12 sm:col-span-7',
		},
		{
			type: 'text',
			name: 'description',
			label: 'models.description',
			minLength: 6,
			maxLength: 5_000,
		},
	],
};
