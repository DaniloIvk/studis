import {
	useMemo,
	useState,
	useRef,
	useEffect,
	type BaseSyntheticEvent,
} from 'react';
import Icons from '../../../common/Icons';
import {
	dateCompare,
	formatDate,
	generateDatePlaceholder,
	DayOfWeekEnum,
	DayOfWeek,
	Month,
} from '@studis/common';
import type { DatePickerProps } from '../../../types/Common';
import Label from './Label';
import { concat } from '../../../common/helpers';
import Message from '../Message';
import useClick from '../../../hooks/useClick';

type CalendarView = 'days' | 'months' | 'years';

function DatePicker({
	name,
	label,
	placeholder,
	register,
	setValue,
	watch,
	errors,
	dateFormat = 'D.M.Y.',
	firstDayOfWeek = 'monday',
	className = '',
	allowClear = false,
	disabled = false,
	readOnly = false,
}: DatePickerProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const value: string | null = watch(name, null);

	// Memoize the date object from the form value
	const selectedDate = useMemo(
		() => (value ? new Date(value) : new Date()),
		[value],
	);

	// State
	const [previewDate, setPreviewDate] = useState<Date>(selectedDate);
	const [calendarDate, setCalendarDate] = useState<Date>(selectedDate);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [view, setView] = useState<CalendarView>('days');
	const [pivotYear, setPivotYear] = useState<number>(
		selectedDate.getFullYear(),
	);

	const currentDate = useMemo(() => new Date(), []);

	// Sync internal state when external value (e.g., from BE) changes
	useEffect(() => {
		if (value) {
			const newDate = new Date(value);
			setCalendarDate(newDate);
			setPivotYear(newDate.getFullYear());
			setPreviewDate(newDate);
		}
	}, [value]);

	// Hooks
	useClick(
		wrapperRef,
		() => {
			setIsOpen(false);
			setView('days');
		},
		isOpen,
	);

	// Data Memos
	const daysOfWeekLabels = useMemo(
		() => DayOfWeek.cases.map((dayOfWeek) => dayOfWeek.translation.slice(0, 3)),
		[firstDayOfWeek],
	);

	const monthsRecord = useMemo(
		() =>
			Month.cases.reduce(
				(accumulator, monthCase) => ({
					...accumulator,
					[monthCase.value]: monthCase.translation,
				}),
				{} as Record<number, string>,
			),
		[],
	);

	const monthCases = useMemo(() => Month.cases, []);

	// Grid Generators
	const dateGrid = useMemo(() => {
		if (view !== 'days') {
			return [];
		}

		const year = calendarDate.getFullYear();
		const month = calendarDate.getMonth();
		const firstOfMonth = new Date(year, month, 1);

		const startDayIndex =
			DayOfWeek[firstDayOfWeek.toUpperCase() as keyof typeof DayOfWeekEnum]
				.value;

		let daysToBackfill = firstOfMonth.getDay() - startDayIndex;
		if (daysToBackfill <= 0) {
			daysToBackfill += 7;
		}

		const startDate = new Date(year, month, 1 - daysToBackfill);
		const grid: Date[] = [];

		for (let i = 0; i < 42; i++) {
			grid.push(new Date(startDate));
			startDate.setDate(startDate.getDate() + 1);
		}

		return grid;
	}, [calendarDate, firstDayOfWeek, view]);

	const yearGrid = useMemo(() => {
		if (view !== 'years') {
			return [];
		}
		// Calculate the start of the 24-year page
		const start = pivotYear - (pivotYear % 24);
		return Array.from({ length: 24 }, (_, index) => start + index);
	}, [pivotYear, view]);

	placeholder ??= generateDatePlaceholder(dateFormat);

	// Styles
	const gridColumnsClass = useMemo(() => {
		switch (view) {
			case 'days':
				return 'grid-cols-[repeat(7,1fr)]';
			case 'months':
				return 'grid-cols-[repeat(2,1fr)]';
			case 'years':
				return 'grid-cols-[repeat(4,1fr)]';
		}
	}, [view]);

	// Handlers
	function handleDateSelect(event: BaseSyntheticEvent): void {
		event.stopPropagation();
		event.preventDefault();

		if (disabled || readOnly) {
			return;
		}

		const target = event.target as HTMLElement;

		if (target && target.dataset.date) {
			setValue(name, target.dataset.date, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
			setPreviewDate(new Date(target.dataset.date));
			setIsOpen(false);
			setView('days');
		}
	}

	function handleMonthSelect(monthIndex: number, event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (disabled || readOnly) {
			return;
		}

		const newDate = new Date(calendarDate);
		newDate.setMonth(monthIndex);
		setCalendarDate(newDate);
		setView('days');
	}

	function handleYearSelect(year: number, event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (disabled || readOnly) {
			return;
		}

		const newDate = new Date(calendarDate);
		newDate.setFullYear(year);
		setCalendarDate(newDate);
		setPivotYear(year);
		setView('months');
	}

	function handleHover(event: BaseSyntheticEvent): void {
		if (disabled || readOnly) {
			return;
		}

		const target = event.target as HTMLElement;

		if (target && target.dataset.date) {
			setPreviewDate(new Date(target.dataset.date));
		}
	}

	function handleClear(event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (disabled || readOnly) {
			return;
		}

		setValue(name, null, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	}

	function resetPreviewDate(): void {
		if (disabled || readOnly) {
			return;
		}

		setPreviewDate(selectedDate);
	}

	function handleOpenToggle(event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (disabled || readOnly) {
			return;
		}

		if (!isOpen) {
			// Ensure the calendar opens to the currently selected date, not just 'today'
			const dateToFocus = value ? new Date(value) : new Date();
			setCalendarDate(dateToFocus);
			setPivotYear(dateToFocus.getFullYear());
			setView('days');
		}

		setIsOpen((previousState) => !previousState);
	}

	function handleNavigation(
		direction: 'prev' | 'next',
		event: BaseSyntheticEvent,
	) {
		event.stopPropagation();
		event.preventDefault();

		const modifier = direction === 'next' ? 1 : -1;

		if (view === 'days') {
			const newDate = new Date(calendarDate);
			newDate.setMonth(calendarDate.getMonth() + modifier);
			setCalendarDate(newDate);
		} else if (view === 'months') {
			const newDate = new Date(calendarDate);
			newDate.setFullYear(calendarDate.getFullYear() + modifier);
			setCalendarDate(newDate);
		} else if (view === 'years') {
			setPivotYear((currentPivot) => currentPivot + modifier * 24);
		}
	}

	function toggleView(targetView: CalendarView, event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (disabled || readOnly) {
			return;
		}

		if (view === targetView) {
			setView('days');
		} else {
			setView(targetView);
			if (targetView === 'years') {
				setPivotYear(calendarDate.getFullYear());
			}
		}
	}

	function handlePopupClick(event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();
	}

	const showClear = allowClear && value && !disabled && !readOnly;

	return (
		<Label
			text={label}
			className={className}
		>
			<div
				ref={wrapperRef}
				className='relative w-full'
			>
				<div
					onClick={handleOpenToggle}
					className={concat(
						'non-material bg-dark/5! dark:bg-light/15! relative rounded-md pl-2 pr-10 select-none leading-10',
						disabled ? 'cursor-not-allowed'
						: readOnly ? 'cursor-default'
						: 'cursor-pointer',
					)}
				>
					<input
						type='date'
						className='w-full text-ellipsis text-nowrap opacity-0 invisible pointer-events-none absolute'
						disabled={disabled}
						readOnly={readOnly}
						{...register(name)}
					/>
					<span
						className={concat(
							'text-nowrap text-ellipsis overflow-hidden block pl-2',
							!(value && dateCompare(selectedDate, previewDate)) &&
								'opacity-75',
							(disabled || readOnly) && 'text-neutral!',
						)}
					>
						{value && previewDate ?
							formatDate(previewDate, dateFormat)
						:	placeholder}
					</span>
					<Icons.Calendar
						className={concat(
							'absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6',
							showClear && 'hidden',
							value && 'fill-primary!',
							(disabled || readOnly) && 'fill-neutral!',
							disabled && 'cursor-not-allowed',
						)}
					/>
					{showClear && (
						<Icons.Close
							onClick={handleClear}
							className='absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6 hover:fill-error!'
						/>
					)}
				</div>
				<div
					onMouseLeave={resetPreviewDate}
					onClick={handlePopupClick}
					className={concat(
						'bg-light! dark:bg-dark! text-dark! dark:text-light! border-primary! absolute top-full left-1/2 -translate-x-1/2 mt-2 w-fit h-fit min-w-75 min-h-75 grid grid-rows-[repeat(8,fit-content)] text-nowrap gap-1 p-2 border-2 rounded-lg text-end select-none z-100 shadow-2xl',
						gridColumnsClass,
						!isOpen && 'hidden',
					)}
				>
					{/* HEADER */}
					<div className='col-span-full flex flex-row justify-between items-center content-stretch mb-2'>
						<Icons.ArrowLeft
							onClick={(event: BaseSyntheticEvent) =>
								handleNavigation('prev', event)
							}
							className={concat(
								'w-6 h-6',
								disabled || readOnly ?
									'fill-neutral! cursor-not-allowed'
								:	'hover:fill-primary!',
							)}
						/>
						<div className='flex gap-1 font-bold'>
							{/* MONTH TOGGLE */}
							<span
								onClick={(event: BaseSyntheticEvent) =>
									toggleView('months', event)
								}
								className={concat(
									'cursor-pointer rounded px-1',
									view === 'months' ?
										'text-primary! bg-primary/10!'
									:	'hover:text-primary!',
								)}
							>
								{monthsRecord[calendarDate.getMonth()]}
							</span>
							{/* YEAR TOGGLE */}
							<span
								onClick={(event: BaseSyntheticEvent) =>
									toggleView('years', event)
								}
								className={concat(
									'cursor-pointer rounded px-1',
									view === 'years' ?
										'text-primary! bg-primary/10!'
									:	'hover:text-primary!',
								)}
							>
								{view === 'years' ?
									`${yearGrid[0]} - ${yearGrid[23]}`
								:	calendarDate.getFullYear()}
							</span>
						</div>
						<Icons.ArrowRight
							onClick={(event: BaseSyntheticEvent) =>
								handleNavigation('next', event)
							}
							className={concat(
								'w-6 h-6',
								disabled || readOnly ?
									'fill-neutral! cursor-not-allowed'
								:	'hover:fill-primary!',
							)}
						/>
					</div>

					{/* VIEW: DAYS */}
					{view === 'days' && (
						<>
							{daysOfWeekLabels.map((dayLabel, index) => (
								<span
									key={index}
									className='px-1 capitalize'
								>
									{dayLabel}
								</span>
							))}
							{dateGrid.map((dateInstance, index) => (
								<span
									key={index}
									onClick={handleDateSelect}
									onMouseOver={handleHover}
									className={concat(
										'hover:text-light! aspect-square text-center content-center p-1 rounded-sm cursor-pointer',
										dateInstance.getMonth() !== calendarDate.getMonth() &&
											'text-neutral!',
										dateCompare(dateInstance, currentDate) &&
											'border-primary! border',
										dateCompare(dateInstance, selectedDate) ? 'bg-primary!' : (
											'hover:bg-primary/50!'
										),
									)}
									data-date={dateInstance.toISOString()}
								>
									{dateInstance.getDate()}
								</span>
							))}
						</>
					)}

					{/* VIEW: MONTHS */}
					{view === 'months' &&
						monthCases.map((monthCase) => (
							<span
								key={monthCase.value}
								onClick={(event: BaseSyntheticEvent) =>
									handleMonthSelect(monthCase.value, event)
								}
								className={concat(
									'leading-10 content-center px-2 rounded-sm text-center cursor-pointer transition-colors',
									calendarDate.getMonth() === monthCase.value ?
										'bg-primary! text-light!'
									:	'hover:bg-primary/50!',
								)}
							>
								{monthCase.translation}
							</span>
						))}

					{/* VIEW: YEARS */}
					{view === 'years' &&
						yearGrid.map((year) => (
							<span
								key={year}
								onClick={(event: BaseSyntheticEvent) =>
									handleYearSelect(year, event)
								}
								className={concat(
									'leading-10 px-2 content-center rounded-sm text-center cursor-pointer transition-colors',
									calendarDate.getFullYear() === year ?
										'bg-primary! text-light!'
									:	'hover:bg-primary/50!',
								)}
							>
								{year}
							</span>
						))}
				</div>
			</div>

			{errors[name] && (
				<Message
					text={String(errors[name]?.message)}
					variant='error'
				/>
			)}
		</Label>
	);
}

export default DatePicker;
