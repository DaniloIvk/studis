import type { FormFieldContract } from '../../types/Form/Form';
import type { TableColumn } from '../../types/Common';
import type { Announcements } from '../../schema/types';
import { formatDate, generateDatePlaceholder } from '@studis/common';

export const searchFields: FormFieldContract[] = [
	{
		type: 'text',
		name: 'search',
		label: 'search',
		className: 'col-span-12 sm:col-span-6',
	},
];

const dateFormat = 'D.M.Y. H:i';

export const tableColumns: TableColumn<Announcements>[] = [
	{ header: 'models.title', accessor: 'title' },
	{
		header: 'models.published_at',
		accessor: (announcement: Announcements) =>
			announcement.createdAt ?
				formatDate(announcement.createdAt, dateFormat)
			:	generateDatePlaceholder(dateFormat),
	},
	{ header: 'models.description', accessor: 'description', cardViewOnly: true },
];
