import { searchFields, tableColumns } from '../config/fields/Course';
import { formConfig } from '../validation/schemas/forms/Course.schema';
import CourseService from '../services/CourseService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';

function Courses() {
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
		/>
	);
}

export default Courses;
