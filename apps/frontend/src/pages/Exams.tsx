import { searchFields, tableColumns, tableColumnsStudent } from '../config/fields/Exam';
import { formConfig } from '../validation/schemas/forms/Exam.schema';
import ExamService from '../services/ExamService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';
import { useAuth } from '../core/context/AuthContext';

function Exams() {
	const { user } = useAuth();
	const canManage = user?.role === 'PROFESSOR' || user?.role === 'ADMIN';

	// If user can't manage exams, show read-only view
	if (!canManage) {
		return <ExamsReadOnly />;
	}

	return (
		<BasicApiResourceModule
			ApiService={ExamService}
			formConfig={formConfig}
			tableColumns={canManage?  tableColumns : tableColumnsStudent}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_exam',
				createModalSubmitLabel: 'buttons.create_exam',
				updateModalTitle: 'modals.update_exam',
				updateModalSubmitLabel: 'buttons.update_exam',
				confirmUpdateTitle: 'popups.exam.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.exam.delete_title',
				confirmDeleteDescription: 'popups.exam.delete_description',
			}}
		/>
	);
}

// Read-only view for students
function ExamsReadOnly() {
	const { user } = useAuth();
  const canManage = user?.role === 'PROFESSOR' || user?.role === 'ADMIN';
	
	return (
		<BasicApiResourceModule
			ApiService={ExamService}
			formConfig={formConfig}
			tableColumns={canManage ? tableColumns : tableColumnsStudent}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_exam',
				createModalSubmitLabel: 'buttons.create_exam',
				updateModalTitle: 'modals.update_exam',
				updateModalSubmitLabel: 'buttons.update_exam',
				confirmUpdateTitle: 'popups.exam.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.exam.delete_title',
				confirmDeleteDescription: 'popups.exam.delete_description',
			}}
      hideActions={!canManage}
      hideAddButton={!canManage}
			readOnly
		/>
	);
}

export default Exams;