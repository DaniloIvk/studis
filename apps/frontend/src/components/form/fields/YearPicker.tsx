import { useMemo, useState, useRef, type BaseSyntheticEvent } from 'react';
import { t } from 'i18next';
import Icons from '../../../common/Icons';
import { concat } from '../../../common/helpers';
import Label from './Label';
import Message from '../Message';
import type { YearPickerProps } from '../../../types/Common';
import useClick from '../../../hooks/useClick';

function YearPicker({
	name,
	label,
	placeholder,
	register,
	setValue,
	watch,
	errors,
	className = '',
	allowClear = false,
	disabled = false,
	readOnly = false,
}: YearPickerProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const value = watch(name, null);
	const [isOpen, setIsOpen] = useState(false);

	useClick(wrapperRef, () => setIsOpen(false), isOpen);

	const [pivotYear, setPivotYear] = useState(
		value ? Number(value) : new Date().getFullYear(),
	);

	const years = useMemo(() => {
		const start = pivotYear - (pivotYear % 24);
		return Array.from({ length: 24 }, (_, i) => start + i);
	}, [pivotYear]);

	function handleSelect(y: number, event: BaseSyntheticEvent) {
		event.stopPropagation();
		if (disabled || readOnly) return;
		setValue(name, y);
		setIsOpen(false);
	}

	function handleClear(event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();
		if (disabled || readOnly) return;
		setValue(name, null);
	}

	function handlePrevRange(event: BaseSyntheticEvent) {
		event.stopPropagation();
		setPivotYear((p) => p - 24);
	}

	function handleNextRange(event: BaseSyntheticEvent) {
		event.stopPropagation();
		setPivotYear((p) => p + 24);
	}

	function handleOpenToggle(event: BaseSyntheticEvent) {
		event.stopPropagation();
		if (!disabled && !readOnly) {
			setIsOpen((prev) => !prev);
		}
	}

	function handlePopupClick(event: BaseSyntheticEvent) {
		event.stopPropagation();
	}

	const showClear =
		allowClear &&
		value !== null &&
		value !== undefined &&
		!disabled &&
		!readOnly;

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
						type='hidden'
						{...register(name)}
					/>
					<span
						className={concat(
							'text-nowrap text-ellipsis overflow-hidden block pl-2',
							!value && 'opacity-75',
							(disabled || readOnly) && 'text-neutral!',
						)}
					>
						{value || placeholder || t('form.select_year')}
					</span>
					<Icons.Calendar
						className={concat(
							'absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6',
							showClear && 'hidden',
							disabled || readOnly ? 'fill-neutral!' : (
								'fill-dark! dark:fill-light!'
							),
						)}
					/>
					{showClear && (
						<Icons.Close
							onClick={handleClear}
							className='absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6 hover:fill-error!'
						/>
					)}
				</div>

				{isOpen && (
					<div
						onClick={handlePopupClick}
						className='bg-light! dark:bg-dark! border-primary! absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max min-w-[220px] h-fit flex flex-col p-2 border-2 rounded-lg z-100 shadow-xl select-none'
					>
						<div className='flex justify-between items-center mb-2 px-1'>
							<Icons.ArrowLeft
								onClick={handlePrevRange}
								className='w-5 h-5 cursor-pointer hover:fill-primary!'
							/>
							<span className='font-bold text-sm'>
								{years[0]} - {years[23]}
							</span>
							<Icons.ArrowRight
								onClick={handleNextRange}
								className='w-5 h-5 cursor-pointer hover:fill-primary!'
							/>
						</div>
						<div className='grid grid-cols-4 gap-1'>
							{years.map((y) => (
								<span
									key={y}
									onClick={(e) => handleSelect(y, e)}
									className={concat(
										'h-10 content-center rounded-sm text-center cursor-pointer text-sm transition-colors',
										Number(value) === y ?
											'bg-primary! text-light!'
										:	'hover:bg-primary/20!',
									)}
								>
									{y}
								</span>
							))}
						</div>
					</div>
				)}
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

export default YearPicker;
