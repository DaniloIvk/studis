import type { FormFieldContract } from '../../types/Form/Form';
import type { TableColumn } from '../../types/Common';
import type { Course } from '../../schema/types';
import UserService from '../../services/UserService';

export const searchFields: FormFieldContract<UserService>[] = [
	{
		type: 'text',
		name: 'search',
		label: 'search',
		className: 'col-span-12 sm:col-span-6',
	},
	{
		type: 'dropdown',
		name: 'professorId',
		label: 'models.professor',
		labelKey: 'fullName',
		apiResponseDataOptions: {
			ApiService: UserService,
			apiRoute: 'getAllProfessors',
		},
		className: 'col-span-12 sm:col-span-6',
		multiselect: true,
		allowClear: true,
	},
];

export const tableColumns: TableColumn<Course>[] = [
	{ header: 'models.index', accessor: 'index' },
	{ header: 'models.name', accessor: 'name' },
	{ header: 'models.espb', accessor: 'espb' },
	{ header: 'models.professor', accessor: ['professor', 'fullName'] },
];
