import { searchFields, tableColumns } from '../config/fields/Course';
import { formConfig } from '../validation/schemas/forms/Course.schema';
import CourseService from '../services/CourseService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';
import { useAuth } from '../core/context/AuthContext';

function Courses() {
	const { user } = useAuth();
	const canManage = user?.role === 'PROFESSOR' || user?.role === 'ADMIN';

	return (
		<BasicApiResourceModule
			ApiService={CourseService}
			formConfig={formConfig}
			tableColumns={tableColumns}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_course',
				createModalSubmitLabel: 'buttons.create_course',
				updateModalTitle: 'modals.update_course',
				updateModalSubmitLabel: 'buttons.update_course',
				confirmUpdateTitle: 'popups.course.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.course.delete_title',
				confirmDeleteDescription: 'popups.course.delete_description',
			}}
      		hideActions={!canManage}
      		hideAddButton={!canManage}
		/>
	);
}

export default Courses;
