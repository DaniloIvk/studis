import {
	useEffect,
	useRef,
	useState,
	type BaseSyntheticEvent,
	type MouseEvent,
} from 'react';
import { t } from 'i18next';
import type { DropdownOption, DropdownProps } from '../../../types/Common';
import useClick from '../../../hooks/useClick';
import Message from '../Message';
import Label from './Label';
import Icons from '../../../common/Icons';
import useService from '../../../hooks/useService';
import { concat } from '../../../common/helpers';

function Dropdown({
	name,
	label,
	register,
	setValue,
	watch,
	errors,
	valueKey = 'id',
	labelKey = 'name',
	options,
	apiResponseDataOptions,
	className = '',
	multiselect = false,
	allowClear = false,
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [_options, _setOptions] = useState<DropdownOption[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const apiService = useService<any>(
		apiResponseDataOptions?.ApiService ?? Object,
	);
	const rawValue = watch<string>(name, '');
	const selectedValues: string[] =
		Array.isArray(rawValue) ? rawValue
		: rawValue ? String(rawValue).split(',')
		: [];

	const labelText =
		selectedValues.length ?
			_options
				.filter((option: DropdownOption) =>
					selectedValues.includes(String(option[valueKey])),
				)
				.map((option: DropdownOption) => option[labelKey])
				.join(', ')
		: multiselect ? t('form.select_options')
		: t('form.select_option');

	function handleSelect(event: MouseEvent<HTMLElement>): void {
		event.stopPropagation();

		const value = String(event.currentTarget.dataset.value!);

		let nextValue: string | string[];

		if (multiselect) {
			nextValue =
				selectedValues.includes(value) ?
					selectedValues.filter((_value: string) => _value !== value)
				:	[...selectedValues, value];
		} else {
			nextValue = selectedValues.includes(value) ? '' : value;
			setIsOpen(false);
		}

		setValue(name, nextValue, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	}

	function toggleIsOpen(): void {
		setIsOpen((isOpen: boolean) => !isOpen);
	}

	function clearValue(event: BaseSyntheticEvent): void {
		event.stopPropagation();

		setValue(name, [], {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	}

	useClick(containerRef, () => setIsOpen(false), isOpen);

	useEffect(() => {
		if (options) {
			_setOptions(options as DropdownOption[]);
			return;
		}

		if (apiResponseDataOptions) {
			const fetchOptions = async () => {
				const route = String(apiResponseDataOptions.apiRoute);

				if (typeof apiService[route] === 'function') {
					const response = await apiService[route]();
					const data: DropdownOption[] = await response.data;
					_setOptions(data);
				}
			};

			fetchOptions();
		}
	}, [options, apiResponseDataOptions]);

	useEffect(() => {
		register(name);
	}, [register, name]);

	return (
		<Label
			text={label}
			className={className}
		>
			<div
				ref={containerRef}
				className='relative'
			>
				<div
					onClick={toggleIsOpen}
					className={concat(
						'non-material bg-dark/5! dark:bg-light/15! rounded-md cursor-pointer flex items-center px-3 select-none',
						allowClear && 'pr-13',
					)}
				>
					<span className='w-full leading-10 text-ellipsis text-nowrap overflow-hidden'>
						{labelText}
					</span>
					{allowClear && (
						<Icons.Close
							onClick={clearValue}
							className={concat(
								'absolute top-1/2 right-3 -translate-y-1/2 w-6 h-6 z-10',
								selectedValues.length > 0 ?
									'fill-dark! dark:fill-light!'
								:	'fill-neutral! cursor-not-allowed',
							)}
						/>
					)}
				</div>

				{isOpen && (
					<div className='absolute top-full left-0 right-0 mt-2 z-50 p-2 border-2 rounded-lg shadow-lg bg-light! dark:bg-dark! border-primary-light! dark:border-primary-dark!'>
						<div className='flex flex-col gap-px max-h-40 overflow-y-auto custom-scrollbar'>
							{_options.map((option: DropdownOption, index: number) => {
								const isSelected = selectedValues.includes(
									String(option[valueKey]),
								);
								return (
									<span
										key={index}
										data-value={String(option[valueKey])}
										onClick={handleSelect}
										className={concat(
											'px-4 py-2 rounded-sm cursor-pointer transition-colors text-sm font-medium',
											isSelected ?
												'bg-primary-light! dark:bg-primary-dark! text-light!'
											:	'hover:bg-primary-hover/50!',
										)}
									>
										{option[labelKey]}
									</span>
								);
							})}
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

export default Dropdown;
