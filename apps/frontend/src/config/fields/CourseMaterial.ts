import type { FormFieldContract } from '../../types/Form/Form';
import type { TableColumn } from '../../types/Common';
import type { User } from '../../schema/types';
import CourseService from '../../services/CourseService';

export const searchFields: FormFieldContract<CourseService>[] = [
	{
		type: 'text',
		name: 'search',
		label: 'search',
		className: 'col-span-12 sm:col-span-6',
	},
	{
		type: 'dropdown',
		name: 'courseId',
		label: 'models.course',
		apiResponseDataOptions: {
			ApiService: CourseService,
			apiRoute: 'getAllWithoutPagination',
		},
		className: 'col-span-12 sm:col-span-6',
		multiselect: true,
		allowClear: true,
	},
];

export const tableColumns: TableColumn<User>[] = [
	{ header: 'models.title', accessor: 'title' },
	{ header: 'models.course', accessor: ['course', 'name'] },
	{ header: 'models.description', accessor: 'description' },
];
