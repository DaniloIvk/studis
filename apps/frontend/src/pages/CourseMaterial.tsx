import { searchFields, tableColumns } from '../config/fields/CourseMaterial';
import { formConfig } from '../validation/schemas/forms/CourseMaterial.schema';
import CourseMaterialService from '../services/CourseMaterialService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';
import { useAuth } from '../core/context/AuthContext';

function CourseMaterial() {

	const {user} = useAuth();
	const canManage = user?.role === 'ADMIN' || user?.role === 'PROFESSOR'
	return (
		<BasicApiResourceModule
			ApiService={CourseMaterialService}
			formConfig={formConfig}
			tableColumns={tableColumns}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_course_material',
				createModalSubmitLabel: 'buttons.create_course_material',
				updateModalTitle: 'modals.update_course_material',
				updateModalSubmitLabel: 'buttons.update_course_material',
				confirmUpdateTitle: 'popups.course_material.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.course_material.delete_title',
				confirmDeleteDescription: 'popups.course_material.delete_description',
			}}
			hideActions = {!canManage}
			hideAddButton = {!canManage}
		/>
	);
}

export default CourseMaterial;
