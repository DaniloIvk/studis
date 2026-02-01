import type { FormFieldContract } from '../../types/Form/Form';
import type { TableColumn } from '../../types/Common';
import type { ExamPeriod } from '../../schema/models';
import { formatDate, generateDatePlaceholder } from '@studis/common';

export const searchFields: FormFieldContract[] = [
	{
		type: 'text',
		name: 'search',
		label: 'search',
		className: 'col-span-12 sm:col-span-7',
	},
	{
		type: 'datePicker',
		name: 'dateFrom',
		label: 'date_from',
		className: 'col-span-12 sm:col-span-6',
	},
	{
		type: 'datePicker',
		name: 'dateTo',
		label: 'date_to',
		className: 'col-span-12 sm:col-span-6',
	},
];

const dateFormat = 'D.M.Y.';

export const tableColumns: TableColumn<ExamPeriod>[] = [
	{ header: 'models.name', accessor: 'name' },
	{
		header: 'models.date_from',
		accessor: (data: ExamPeriod) =>
			data.dateFrom ?
				formatDate(data.dateFrom, dateFormat)
			:	generateDatePlaceholder(dateFormat),
	},
	{
		header: 'models.date_to',
		accessor: (data: ExamPeriod) =>
			data.dateTo ?
				formatDate(data.dateTo, dateFormat)
			:	generateDatePlaceholder(dateFormat),
	},
];
