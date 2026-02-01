import z from 'zod';
import type { FormContract } from '../../../types/Form/Form';
import ValidationUtils from '../../Utils';

const ExamPeriodMaterialSchema = z
	.object({
		name: z.string().min(2).max(255).readonly(),
		dateFrom: z.preprocess(
			ValidationUtils.convertValueToDate,
			z.date().readonly(),
		),
		dateTo: z.preprocess(
			ValidationUtils.convertValueToDate,
			z.date().readonly(),
		),
	})
	.refine(
		(examPeriod) => {
			return (
				examPeriod.dateFrom &&
				examPeriod.dateTo &&
				examPeriod.dateFrom < examPeriod.dateTo
			);
		},
		{ path: ['dateTo'], params: { i18n: 'min.date', min: 'dateFrom' } },
	)
	.refine(
		(examPeriod) => {
			return (
				examPeriod.dateFrom &&
				examPeriod.dateTo &&
				examPeriod.dateFrom < examPeriod.dateTo
			);
		},
		{ path: ['dateFrom'], params: { i18n: 'max.date', max: 'dateTo' } },
	)
	.readonly();

export const formConfig: FormContract = {
	schema: ExamPeriodMaterialSchema,
	fields: [
		{
			type: 'text',
			name: 'name',
			label: 'models.title',
			minLength: 2,
			maxLength: 255,
			className: 'col-span-12 sm:col-span-7',
		},
		{
			type: 'datePicker',
			name: 'dateFrom',
			label: 'models.date_from',
			className: 'col-span-12 sm:col-span-6',
		},
		{
			type: 'datePicker',
			name: 'dateTo',
			label: 'models.date_to',
			className: 'col-span-12 sm:col-span-6',
		},
	],
};
