import { searchFields, tableColumns } from '../config/fields/ExamPeriod';
import { formConfig } from '../validation/schemas/forms/ExamPeriod.schema';
import ExamPeriodService from '../services/ExamPeriodService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';

function ExamPeriods() {
	return (
		<BasicApiResourceModule
			ApiService={ExamPeriodService}
			formConfig={formConfig}
			tableColumns={tableColumns}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_exam_period',
				createModalSubmitLabel: 'buttons.create_exam_period',
				updateModalTitle: 'modals.update_exam_period',
				updateModalSubmitLabel: 'buttons.update_exam_period',
				confirmUpdateTitle: 'popups.exam_period.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.exam_period.delete_title',
				confirmDeleteDescription: 'popups.exam_period.delete_description',
			}}
		/>
	);
}

export default ExamPeriods;
