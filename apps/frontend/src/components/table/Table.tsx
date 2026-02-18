import { useMemo, useState, type ReactNode } from 'react';
import { t } from 'i18next';
import Icons from '../../common/Icons';
import Action from './Action';
import Paginator from '../paginator/Paginator';
import useQuery from '../../hooks/useQuery';
import Form from '../form/Form';
import { concat, dataGet, logData } from '../../common/helpers';
import type {
	ActionContract,
	ItemProps,
	Query,
	TableColumn,
	TableConfig,
	TableProps,
} from '../../types/Common';
import PrimaryButton from '../common/PrimaryButton';

function Table({
	data = [],
	columns = [],
	filters,
	defaultFilters = {},
	showRowNumbers,
	showActions,
	showPaginator,
	syncRowNumbersWithPaginator = true,
	onAdd,
	onEditAction,
	onRemoveAction,
	actions = [],
}: TableProps) {
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const { _data, _pagination } = getDataConfig();
	const query = useQuery();
	const paginatorRowNumberOffset =
		(
			syncRowNumbersWithPaginator &&
			_pagination?.currentPage &&
			_pagination?.perPage &&
			isFinite(_pagination?.currentPage!) &&
			isFinite(_pagination?.perPage!)
		) ?
			(_pagination.currentPage - 1) * _pagination.perPage
		:	0;

	function getDataConfig(): TableConfig {
		if (Array.isArray(data)) {
			return { _data: data, _pagination: null };
		}
		if ('data' in data) {
			return {
				_data: data.data,
				_pagination: 'pagination' in data ? data.pagination : null,
			};
		}

		return { _data: [], _pagination: null };
	}

	const editAction: ActionContract = {
		name: 'edit',
		icon: Icons.Edit,
		action: onEditAction || logData,
		iconClassName:
			'fill-primary! dark:fill-primary-light! group-hover:fill-primary-light! group-active:fill-primary-light!',
	};

	const removeAction: ActionContract = {
		name: 'remove',
		icon: Icons.Delete,
		action: onRemoveAction || logData,
		iconClassName:
			'fill-danger-dark! group-hover:fill-danger! group-active:fill-danger!',
	};

	const tableColumns = useMemo<typeof columns>(
		() =>
			[...columns].map((column: TableColumn) => {
				return { ...column, header: t(column.header) };
			}),
		[columns],
	);

	const tableData = useMemo<typeof _data>(
		() =>
			[..._data].map((item: ItemProps) => {
				const itemActions = item.actions ? [...item.actions] : [];

				if (
					onEditAction &&
					item.showEditAction !== false &&
					(item.showEditAction == true || item.showEditAction === undefined)
				) {
					itemActions.unshift(editAction);
				}

				itemActions.push(...(actions ?? []));

				if (
					onRemoveAction &&
					item.showRemoveAction !== false &&
					(item.showRemoveAction === true ||
						item.showRemoveAction === undefined)
				) {
					itemActions.push(removeAction);
				}

				item = { ...item, actions: itemActions };

				return item;
			}),
		[_data],
	);

	const itemsHaveActions = useMemo(
		() => tableData.some((item) => item.actions && item.actions.length > 0),
		[tableData],
	);

	const columnCount =
		tableColumns.length +
		(showRowNumbers ? 1 : 0) +
		(showActions && itemsHaveActions ? 1 : 0);

	function renderCell(item: ItemProps, column: TableColumn, rowNumber: number) {
		if (typeof column.accessor === 'function') {
			return column.accessor(item, rowNumber);
		}

		let value = dataGet(item, column.accessor);

		if (value instanceof Date) {
			value = value.toLocaleString();
		}

		return value as ReactNode;
	}

	function handleFilterChange(data: Query) {
		query.update({ ...data, page: 1 });
	}

	function handleFiltersToggle() {
		setShowFilters((showFilters: boolean) => !showFilters);
	}

	function getColumnVisibility(column: TableColumn): string {
		return column.cardViewOnly === true ? 'lg:hidden!' : '';
	}

	return (
		<div className='relative w-full h-full flex flex-col justify-start items-center content-stretch overflow-x-visible overflow-y-scroll scroll-container'>
			{/**
			 * Header section
			 */}
			<div className='w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] grid-rows-[1fr_auto_auto] lg:grid-rows-1 justify-stretch items-end content-stretch place-items-end-safe gap-6 p-6'>
				{filters && filters.length > 0 && (
					<>
						<div className='relative flex flex-col justify-start items-start content-stretch gap-4 w-full h-full min-h-10 pt-10 xs:pb-0'>
							<div
								onClick={handleFiltersToggle}
								className='fill-primary! hover:fill-primary-hover! absolute top-0 left-0 right-0 flex flex-row justify-center items-center content-stretch gap-1 w-fit h-10 place-self-end'
							>
								<Icons.Filter className='w-8 h-8' />
								{showFilters ?
									<Icons.ArrowDropUp className='w-8 h-8' />
								:	<Icons.ArrowDropDown className='w-8 h-8' />}
							</div>
							<Form
								fields={filters}
								defaultValues={defaultFilters}
								onSubmit={handleFilterChange}
								submitButtonText='buttons.search'
								className={concat('min-w-full', !showFilters && 'hidden')}
								resubmitOnReset
								showSubmit
								showReset
							/>
						</div>
						<div className='bg-primary! w-full lg:w-px h-px lg:h-full'></div>
					</>
				)}
				{onAdd && (
					<PrimaryButton
						label='add'
						onClick={onAdd}
					/>
				)}
			</div>
			{/**
			 * End of the Header section
			 */}

			{/**
			 * Data section
			 */}
			<div className='flex-1 w-full min-h-0 flex lg:block flex-col justify-start items-center content-stretch'>
				<table className='w-full h-full max-h-max lg:table table-auto text-pretty wrap-anywhere'>
					{/**
					 * Table header section
					 */}
					{((showPaginator && _pagination && _pagination.total > 6) ||
						tableData.length > 0) && (
						<thead className='lg:sticky top-0 z-10 lg:drop-shadow-bottom-md lg:rounded-b-xl lg:**:first:rounded-bl-xl! lg:**:last:rounded-br-xl!'>
							<tr className='w-full hidden lg:table-row capitalize *:py-4'>
								{showRowNumbers === true && <th>#</th>}
								{tableColumns.map((column: TableColumn, index: number) => (
									<th
										key={index}
										className={getColumnVisibility(column)}
									>
										{column.header}
									</th>
								))}
								{showActions === true && itemsHaveActions === true && (
									<th>{t('actions')}</th>
								)}
							</tr>
							<tr
								className={concat(
									'w-full flex lg:hidden flex-row justify-center items-center content-stretch lg:*:py-4',
									tableData.length > 6 && 'py-8',
								)}
							>
								<td colSpan={columnCount}>
									{showPaginator && _pagination && _pagination.total > 6 && (
										<Paginator {..._pagination} />
									)}
								</td>
							</tr>
						</thead>
					)}
					{/**
					 * End of the Table header section
					 */}

					{/**
					 * Table body section
					 */}
					<tbody className='w-full h-full flex lg:table-row-group flex-col justify-start items-center content-stretch gap-6 lg:gap-3 px-3 py-6 lg:p-0 mb-auto [&>tr:not(.table-spacer)+tr:not(.table-spacer)]:lg:border-t'>
						{tableData.length > 0 ?
							<>
								{tableData.map((item: ItemProps, itemIndex: number) => (
									<tr
										key={itemIndex}
										className={concat(
											'bg-primary-light! dark:bg-primary-dark! lg:bg-inherit! lg:dark:bg-inherit! **:bg-transparent!',
											'lg:border-1y rounded-xl lg:rounded-none',
											'*:text-center w-full lg:w-auto lg:h-fit py-2 lg:py-0 *:px-4 *:py-2 lg:*:py-4',
											'min-w-0 flex lg:table-row flex-col justify-stretch items-stretch content-stretch',
											'shadow-lg lg:shadow-none',
										)}
									>
										{showRowNumbers === true && (
											<td className='hidden lg:table-cell'>
												{itemIndex + paginatorRowNumberOffset + 1}
											</td>
										)}
										{tableColumns?.map((column: TableColumn, index: number) => (
											<td
												key={index}
												className={concat(
													'flex lg:table-cell flex-row justify-evenly items-center content-center *:text-start',
													getColumnVisibility(column),
												)}
											>
												<span className='flex-1 inline-block lg:hidden capitalize font-bold'>
													{column.header}:
												</span>
												<span className='flex-2'>
													{renderCell(
														item,
														column,
														itemIndex + paginatorRowNumberOffset + 1,
													)}
												</span>
											</td>
										))}
										{showActions === true && itemsHaveActions === true && (
											<td className='mt-2 lg:mt-0 select-none'>
												<div className='grid lg:flex grid-cols-2 grid-rows-1 auto-cols-max auto-rows-min flex-row justify-center items-center content-center gap-2'>
													{item.actions?.map((action, actionIndex: number) => (
														<Action
															key={actionIndex}
															name={action.name}
															icon={action.icon}
															action={() => action.action(item, itemIndex + 1)}
															iconClassName={action.iconClassName}
														/>
													))}
												</div>
											</td>
										)}
									</tr>
								))}
								<tr className='table-spacer block lg:table-row w-full h-full'>
									<td
										colSpan={columnCount}
										className='table-spacer block lg:table-cell w-full h-full'
									></td>
								</tr>
							</>
						:	<tr>
								<td
									colSpan={columnCount}
									className='text-center'
								>
									{t('no_search_results')}
								</td>
							</tr>
						}
					</tbody>
					{/**
					 * End of the Table body section
					 */}

					{/**
					 * Table footer section
					 */}
					{showPaginator && _pagination && _pagination.total > 0 && (
						<tfoot className='relative lg:sticky -bottom-px left-0 right-0 w-full z-10 block lg:table-footer-group lg:drop-shadow-top-md lg:rounded-t-xl lg:**:first:rounded-tl-xl! lg:**:last:rounded-tr-xl!'>
							<tr className='w-full flex lg:table-row flex-row justify-center items-center content-stretch py-8 lg:*:py-4'>
								<td colSpan={columnCount}>
									<Paginator {..._pagination} />
								</td>
							</tr>
						</tfoot>
					)}
					{/**
					 * End of the Table footer section
					 */}
				</table>
			</div>
			{/**
			 * End of the Data section
			 */}
		</div>
	);
}

export default Table;
