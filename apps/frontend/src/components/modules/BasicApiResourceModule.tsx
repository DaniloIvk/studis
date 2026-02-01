import { useEffect, useRef, useState } from 'react';
import type { ItemProps } from '../../types/Common';
import type { PaginatorData } from '../../types/Common';
import type { ForwardedFormProps } from '../../types/Form/Form';
import { awaitSafely } from '../../common/helpers';
import { useConfirm } from '../../hooks/useConfirm';
import Table from '../table/Table';
import ModalForm from '../form/ModalForm';
import useLoading from '../../hooks/useLoading';
import useHideModel from '../../hooks/useHideModel';
import useService from '../../hooks/useService';
import useQuery from '../../hooks/useQuery';
import type { BasicApiResourceModuleProps } from '../../types/ApiResourceModule';

function BasicApiResourceModule<Model extends ItemProps>({
	ApiService,
	formConfig,
	tableColumns,
	searchFields,
	translations,
}: BasicApiResourceModuleProps<Model>) {
	const { setLoading } = useLoading();
	const createFormReference = useRef<ForwardedFormProps>(null);
	const { hideModal: hideCreateModal, setHideModal: setHideCreateModal } =
		useHideModel();
	const updateFormReference = useRef<ForwardedFormProps>(null);
	const { hideModal: hideUpdateModal, setHideModal: setHideUpdateModal } =
		useHideModel();
	const [data, setData] = useState<PaginatorData<Partial<Model>> | []>([]);
	const [itemData, setItemData] = useState<ItemProps>({});
	const apiService = useService(ApiService);
	const confirmUpdate = useConfirm({
		title: translations.confirmUpdateTitle,
		description: translations.confirmUpdateDescription,
		onConfirm: handleUpdate,
		discardable: true,
	});
	const confirmDelete = useConfirm({
		title: translations.confirmDeleteTitle,
		description: translations.confirmDeleteDescription,
		onConfirm: handleDelete,
	});
	const query = useQuery();

	function handleAdd(): void {
		setHideCreateModal(false);
	}

	async function handleCreate(formData: Model): Promise<void> {
		setLoading(true);

		await awaitSafely(
			[apiService, 'create'],
			function () {
				setHideCreateModal(true);
				getData();
			},
			createFormReference.current?.setServerErrors,
			undefined,
			formData,
		);

		setLoading(false);
	}

	function handleEdit(itemData: ItemProps): void {
		setItemData(itemData);
		setHideUpdateModal(false);
	}

	async function handleUpdate(formData: Model): Promise<void> {
		setLoading(true);

		await awaitSafely(
			[apiService, 'update'],
			function () {
				setHideUpdateModal(true);
				getData();
			},
			updateFormReference.current?.setServerErrors,
			undefined,
			itemData.id,
			formData,
		);

		setLoading(false);
	}

	async function handleDelete(itemData: ItemProps): Promise<void> {
		setLoading(true);

		await awaitSafely(
			[apiService, 'delete'],
			getData,
			undefined,
			undefined,
			itemData.id,
		);

		setLoading(false);
	}

	function getData(): void {
		setLoading(true);

		awaitSafely(
			[apiService, 'getAll'],
			setData,
			undefined,
			undefined,
			query.value,
		);

		setLoading(false);
	}

	useEffect(getData, [query.value, ApiService]);

	return (
		<div className='w-full h-full flex flex-col justify-start items-center content-stretch'>
			<Table
				data={data}
				columns={tableColumns}
				filters={searchFields}
				onEditAction={handleEdit}
				onRemoveAction={confirmDelete.ask}
				onAdd={handleAdd}
				showRowNumbers
				showPaginator
				showActions
			/>
			<ModalForm
				ref={createFormReference}
				submitButtonText={translations.createModalSubmitLabel}
				onSubmit={handleCreate}
				hidden={hideCreateModal}
				setHidden={setHideCreateModal}
				title={translations.createModalTitle}
				{...formConfig}
				showSubmit
			/>
			<ModalForm
				ref={updateFormReference}
				defaultValues={itemData}
				submitButtonText={translations.updateModalSubmitLabel}
				onSubmit={confirmUpdate.ask}
				hidden={hideUpdateModal}
				setHidden={setHideUpdateModal}
				title={translations.updateModalTitle}
				{...formConfig}
				showSubmit
			/>
			{confirmUpdate.Component}
			{confirmDelete.Component}
		</div>
	);
}

export default BasicApiResourceModule;
