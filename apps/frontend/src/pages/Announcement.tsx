import { searchFields, tableColumns } from '../config/fields/Announcement';
import { formConfig } from '../validation/schemas/forms/Announcement.schema';
import AnnouncementService from '../services/AnnouncementService';
import BasicApiResourceModule from '../components/modules/BasicApiResourceModule';

function Announcement() {
	return (
		<BasicApiResourceModule
			ApiService={AnnouncementService}
			formConfig={formConfig}
			tableColumns={tableColumns}
			searchFields={searchFields}
			translations={{
				createModalTitle: 'modals.create_announcement',
				createModalSubmitLabel: 'buttons.create_announcement',
				updateModalTitle: 'modals.update_announcement',
				updateModalSubmitLabel: 'buttons.update_announcement',
				confirmUpdateTitle: 'popups.announcement.update_title',
				confirmUpdateDescription: undefined,
				confirmDeleteTitle: 'popups.announcement.delete_title',
				confirmDeleteDescription: 'popups.announcement.delete_description',
			}}
		/>
	);
}

export default Announcement;
