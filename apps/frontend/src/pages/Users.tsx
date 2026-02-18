import { searchFields, tableColumns } from '../config/fields/User';
import { getFormConfig } from '../validation/schemas/forms/User.schema';
import UserService from '../services/UserService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';
import Role from '../enums/Role';

function Users() {
	return (
		<BasicApiResourceModule
			ApiService={UserService}
			formConfig={getFormConfig(Role.STUDENT.value)}
			tableColumns={tableColumns}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_user',
				createModalSubmitLabel: 'buttons.create_user',
				updateModalTitle: 'modals.update_user',
				updateModalSubmitLabel: 'buttons.update_user',
				confirmUpdateTitle: 'popups.user.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.user.delete_title',
				confirmDeleteDescription: 'popups.user.delete_description',
			}}
		/>
	);
}

export default Users;
