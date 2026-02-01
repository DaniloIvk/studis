import Icons from '../../common/Icons';
import type { Pagination, PaginatorConfig } from '../../types/Paginator';
import CurrentPage from './CurrentPage';
import PageNumber from './PageNumber';
import MorePages from './MorePages';
import { useEffect, useMemo, useState } from 'react';
import { useScreenSizeBreakpoint } from '../../hooks/useScreenSizeBreakpoint';
import useQuery from '../../hooks/useQuery';

const FIRST_PAGE = 1;
const FIRST_PAGE_INDEX = 0;
const SMALL_PAGINATOR_MAXIMUM_PAGE_COUNT = 7;
const LARGE_PAGINATOR_MAXIMUM_PAGE_COUNT = 9;

function Paginator({ currentPage, pageCount: totalPages }: Pagination) {
	const [_currentPage, _setCurrentPage] = useState<number>(currentPage);
	const [maximumPageCount, setMaximumPageCount] = useState<number>(
		SMALL_PAGINATOR_MAXIMUM_PAGE_COUNT,
	);
	const useLargePaginator = useScreenSizeBreakpoint();
	const query = useQuery();

	const firstEllipsisIndex = 1;
	const secondEllipsisIndex = maximumPageCount - 2;
	const pageLimitForOneEllipsis = maximumPageCount - 2;
	const {
		buttonCount,
		firstEllipsis,
		secondEllipsis,
		hasFirstEllipsis,
		hasSecondEllipsis,
	} = useMemo(generatePaginatorConfig, [query.value]);

	function generatePaginatorConfig(): PaginatorConfig {
		if (totalPages < maximumPageCount) {
			/**
			 * No ellipsis (example: 1, 2, 3, 4)
			 */
			return {
				buttonCount: totalPages,
				firstEllipsis: { fromPage: 0, toPage: 0 },
				secondEllipsis: { fromPage: 0, toPage: 0 },
				hasFirstEllipsis: false,
				hasSecondEllipsis: false,
			};
		}

		if (_currentPage < pageLimitForOneEllipsis) {
			/**
			 * One ellipsis (example: 1, 2, 3, 4, 5, ..., 78)
			 */
			return {
				buttonCount: maximumPageCount,
				firstEllipsis: { fromPage: 0, toPage: 0 },
				secondEllipsis: { fromPage: 6, toPage: totalPages - 1 },
				hasFirstEllipsis: false,
				hasSecondEllipsis: true,
			};
		}

		if (totalPages - _currentPage + 1 < pageLimitForOneEllipsis) {
			/**
			 * One ellipsis (example: 1, ..., 31, 32, 33, 34, 35)
			 */
			return {
				buttonCount: maximumPageCount,
				firstEllipsis: {
					fromPage: 2,
					toPage: totalPages - pageLimitForOneEllipsis,
				},
				secondEllipsis: { fromPage: 0, toPage: 0 },
				hasFirstEllipsis: true,
				hasSecondEllipsis: false,
			};
		}

		/**
		 * Two ellipsis (example: 1, ..., 7, 8, 9, ..., 15)
		 */
		const pagesAroundEllipsesCount = Math.ceil((maximumPageCount - 4) / 2);

		return {
			buttonCount: maximumPageCount,
			firstEllipsis: {
				fromPage: 2,
				toPage: _currentPage - pagesAroundEllipsesCount,
			},
			secondEllipsis: {
				fromPage: _currentPage + pagesAroundEllipsesCount,
				toPage: totalPages - 1,
			},
			hasFirstEllipsis: true,
			hasSecondEllipsis: true,
		};
	}

	function getPageNumberFromIndex(index: number) {
		if (index === FIRST_PAGE_INDEX) {
			return FIRST_PAGE;
		}
		if (index === buttonCount - 1) {
			return totalPages;
		}
		if (hasFirstEllipsis && index >= firstEllipsisIndex) {
			return hasSecondEllipsis ?
					_currentPage - Math.ceil(buttonCount / 2) + index + 1
				:	totalPages - buttonCount + index + 1;
		}

		return index + 1;
	}

	function createPageNumbers() {
		return Array.from({ length: buttonCount }, function (_, index) {
			const pageNumber = getPageNumberFromIndex(index);

			if (hasFirstEllipsis && index === firstEllipsisIndex) {
				return (
					<MorePages
						key={index}
						onClick={_setCurrentPage}
						{...firstEllipsis}
					/>
				);
			}
			if (hasSecondEllipsis && index === secondEllipsisIndex) {
				return (
					<MorePages
						key={index}
						onClick={_setCurrentPage}
						{...secondEllipsis}
					/>
				);
			}
			if (pageNumber === _currentPage) {
				return (
					<CurrentPage
						key={index}
						onClick={_setCurrentPage}
						pageNumber={pageNumber}
					/>
				);
			}

			return (
				<PageNumber
					key={index}
					onClick={_setCurrentPage}
					pageNumber={pageNumber}
				/>
			);
		});
	}

	function handleOnFirstPage() {
		_setCurrentPage(FIRST_PAGE);
	}

	function handleOnLastPage() {
		_setCurrentPage(totalPages);
	}

	function handleOnPreviousPage() {
		_setCurrentPage(Math.max(_currentPage - 1, FIRST_PAGE));
	}

	function handleOnNextPage() {
		_setCurrentPage(Math.min(_currentPage + 1, totalPages));
	}

	useEffect(() => {
		setMaximumPageCount(
			useLargePaginator ?
				LARGE_PAGINATOR_MAXIMUM_PAGE_COUNT
			:	SMALL_PAGINATOR_MAXIMUM_PAGE_COUNT,
		);
	}, [useLargePaginator]);

	useEffect(() => {
		_setCurrentPage(currentPage);
	}, [currentPage]);

	useEffect(() => {
		query.update({ page: _currentPage });
	}, [_currentPage]);

	useEffect(() => {
		query.update({ page: _currentPage });
	}, []);

	return (
		<div className='bg-transparent! not-odd:place-self-center w-fit h-fit mx-auto grid grid-cols-2 sm:grid-cols-[min-content_1fr_1fr_min-content] auto-rows-max gap-4 select-none'>
			<div className='row-start-2 sm:row-start-1 h-full flex flex-row justify-end sm:justify-center items-center content-stretch gap-4'>
				<button
					type='button'
					onClick={handleOnFirstPage}
					className='group enabled:cursor-pointer disabled:cursor-not-allowed'
					disabled={_currentPage <= FIRST_PAGE}
				>
					<Icons.ArrowLeftEnd className='w-fit h-5 opacity-50 group-disabled:opacity-30 group-enabled:hover:opacity-100 group-enabled:hover:scale-110 group-enabled:hover:drop-shadow-icon group-enabled:active:drop-shadow-icon' />
				</button>
				<button
					type='button'
					onClick={handleOnPreviousPage}
					className='group enabled:cursor-pointer disabled:cursor-not-allowed'
					disabled={_currentPage <= FIRST_PAGE}
				>
					<Icons.ArrowLeft className='w-fit h-5 opacity-50 group-disabled:opacity-30 group-enabled:hover:opacity-100 group-enabled:hover:scale-110 group-enabled:hover:drop-shadow-icon group-enabled:active:drop-shadow-icon' />
				</button>
			</div>
			<div className='row-start-1 col-span-2 flex flex-row justify-evenly items-baseline content-stretch gap-2'>
				{useMemo(createPageNumbers, [query.value])}
			</div>
			<div className='row-start-2 sm:row-start-1 h-full flex flex-row justify-start sm:justify-center items-center content-stretch gap-4'>
				<button
					type='button'
					onClick={handleOnNextPage}
					className='group enabled:cursor-pointer disabled:cursor-not-allowed'
					disabled={_currentPage >= totalPages}
				>
					<Icons.ArrowRight className='w-fit h-5 opacity-50 group-disabled:opacity-30 group-enabled:hover:opacity-100 group-enabled:hover:scale-110 group-enabled:hover:drop-shadow-icon group-enabled:active:drop-shadow-icon' />
				</button>
				<button
					type='button'
					onClick={handleOnLastPage}
					className='group enabled:cursor-pointer disabled:cursor-not-allowed'
					disabled={_currentPage >= totalPages}
				>
					<Icons.ArrowRightEnd className='w-fit h-5 opacity-50 group-disabled:opacity-30 group-enabled:hover:opacity-100 group-enabled:hover:scale-110 group-enabled:hover:drop-shadow-icon group-enabled:active:drop-shadow-icon' />
				</button>
			</div>
		</div>
	);
}

export default Paginator;
