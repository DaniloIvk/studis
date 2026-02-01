import { useMemo, useState, useRef, type BaseSyntheticEvent } from 'react';
import { Month } from '@studis/common';
import { t } from 'i18next';
import Icons from '../../../common/Icons';
import { concat } from '../../../common/helpers';
import Label from './Label';
import Message from '../Message';
import type { MonthPickerProps } from '../../../types/Common';
import useClick from '../../../hooks/useClick';

function MonthPicker({
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
}: MonthPickerProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const value = watch(name, null);
	const [isOpen, setIsOpen] = useState(false);

	useClick(wrapperRef, () => setIsOpen(false), isOpen);

	const monthCases = useMemo(() => Month.cases, []);

	const selectedMonthName = useMemo(() => {
		if (value === null || value === undefined) return null;
		return monthCases.find((m) => m.value === Number(value))?.translation;
	}, [value, monthCases]);

	function handleSelect(m: number, event: BaseSyntheticEvent) {
		event.stopPropagation();
		if (disabled || readOnly) return;
		setValue(name, m);
		setIsOpen(false);
	}

	function handleClear(event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();
		if (disabled || readOnly) return;
		setValue(name, null);
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
							!selectedMonthName && 'opacity-75',
							(disabled || readOnly) && 'text-neutral!',
						)}
					>
						{selectedMonthName || placeholder || t('form.select_month')}
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
						className='bg-light! dark:bg-dark! border-primary! absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max min-w-[200px] h-fit grid grid-cols-2 gap-1 p-2 border-2 rounded-lg z-100 shadow-xl select-none'
					>
						{monthCases.map((m) => (
							<span
								key={m.value}
								onClick={(e) => handleSelect(m.value, e)}
								className={concat(
									'h-10 content-center px-2 rounded-sm text-center cursor-pointer transition-colors',
									Number(value) === m.value ?
										'bg-primary! text-light!'
									:	'hover:bg-primary/20!',
								)}
							>
								{m.translation}
							</span>
						))}
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

export default MonthPicker;
