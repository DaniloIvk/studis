import { searchFields, tableColumns, tableColumnsStudent } from '../config/fields/Grade';
import { formConfig } from '../validation/schemas/forms/Grade.schema';
import GradeService from '../services/GradeService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';
import { useAuth } from '../core/context/AuthContext';

function Grades() {
	const { user } = useAuth();
	const canManage = user?.role === 'PROFESSOR' || user?.role === 'ADMIN';
	const isStudent = user?.role === 'STUDENT';

	return (
		<BasicApiResourceModule
			ApiService={GradeService}
			formConfig={formConfig}
			tableColumns={isStudent ? tableColumnsStudent : tableColumns}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_grade',
				createModalSubmitLabel: 'buttons.create_grade',
				updateModalTitle: 'modals.update_grade',
				updateModalSubmitLabel: 'buttons.update_grade',
				confirmUpdateTitle: 'popups.grade.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.grade.delete_title',
				confirmDeleteDescription: 'popups.grade.delete_description',
			}}
			hideActions={!canManage}
			hideAddButton={!canManage}
		/>
	);
}

export default Grades;