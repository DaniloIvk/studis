import type { FormFieldContract } from '../../types/Form/Form';
import type { TableColumn } from '../../types/Common';
import type { User } from '../../schema/types';
import Role from '../../enums/Role';

export const searchFields: FormFieldContract[] = [
	{
		type: 'text',
		name: 'search',
		label: 'search',
		className: 'col-span-12 sm:col-span-6',
	},
	{
		type: 'enumDropdown',
		name: 'role',
		label: 'models.role',
		Enum: Role,
		className: 'col-span-12 sm:col-span-6',
		multiselect: true,
		allowClear: true,
	},
];

export const tableColumns: TableColumn<User>[] = [
	{
		header: 'models.role',
		accessor: (user: User) => Role.from(user.role)!.translation,
	},
	{ header: 'models.index', accessor: 'index' },
	{ header: 'models.name', accessor: 'fullName' },
	{ header: 'models.email', accessor: 'email' },
	{
		header: 'models.phone_number',
		accessor: 'phoneNumber',
		cardViewOnly: true,
	},
];
