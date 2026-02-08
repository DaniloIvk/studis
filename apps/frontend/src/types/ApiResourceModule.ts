import type ApiService from '../core/service/ApiService';
import type {
	Constructor,
	FormContract,
	FormFieldContract,
	ItemProps,
	TableColumn,
} from './Common';

export type BasicApiResourceModuleProps<Model extends ItemProps> = {
	readonly ApiService: Constructor<InstanceType<typeof ApiService>>;
	readonly formConfig: FormContract;
	readonly tableColumns: readonly TableColumn<Model>[];
	readonly searchFields: readonly FormFieldContract[];
	readonly translations: {
		readonly createModalTitle?: string;
		readonly createModalSubmitLabel?: string;
		readonly updateModalTitle?: string;
		readonly updateModalSubmitLabel?: string;
		readonly confirmUpdateTitle: string;
		readonly confirmUpdateDescription?: string;
		readonly confirmDeleteTitle: string;
		readonly confirmDeleteDescription?: string;
	};
	hideActions?: boolean; // ✅ Add this
	hideAddButton?: boolean; // ✅ Add this
	readOnly?: boolean; // ✅ Add this
};
