import {
	forwardRef,
	useImperativeHandle,
	type BaseSyntheticEvent,
	type ForwardedRef,
} from 'react';
import { t } from 'i18next';
import z from 'zod';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { concat, logErrors } from '../../common/helpers';
import type { ErrorResponse } from '../../types/Response';
import type {
	FieldComponentMap,
	FormFieldContract,
	FormFieldProps,
	FormProps,
	ForwardedFormProps,
} from '../../types/Common';
import TextField from './fields/TextField';
import MaskedField from './fields/MaskedField';
import Dropdown from './fields/Dropdown';
import EnumDropdown from './fields/EnumDropdown';
import FileUpload from './fields/FileUpload';
import DatePicker from './fields/DatePicker';
import PrimaryButton from '../common/PrimaryButton';
import MonthPicker from './fields/MonthPicker';
import YearPicker from './fields/YearPicker';

const FIELD_COMPONENTS: FieldComponentMap = {
	text: TextField,
	number: TextField,
	email: TextField,
	masked: MaskedField,
	dropdown: Dropdown,
	enumDropdown: EnumDropdown,
	fileUpload: FileUpload,
	datePicker: DatePicker,
	monthPicker: MonthPicker,
	yearPicker: YearPicker,
} as const;

const DEFAULT_FIELD_PROPS: Partial<FormFieldProps> = {
	autoCapitalize: 'off',
	autoComplete: 'off',
	className: 'col-span-full',
};

const Form = forwardRef(
	(
		{
			schema = z.any(),
			onSubmit,
			fields,
			showSubmit = true,
			showReset,
			resubmitOnReset,
			submitButtonText = 'buttons.submit',
			defaultValues = {},
			featuredImage,
			className = '',
		}: FormProps,
		ref: ForwardedRef<ForwardedFormProps>,
	) => {
		type SchemaType = z.infer<typeof schema>;

		const {
			register,
			handleSubmit,
			setValue,
			setError,
			control,
			watch,
			reset,
			formState: { errors, isValid, isSubmitting, isValidating },
		} = useForm<SchemaType>({
			resolver: zodResolver(schema),
			mode: 'all',
			reValidateMode: 'onChange',
			defaultValues: defaultValues,
			delayError: 150,
		});

		async function handleOnSubmit(
			data: SchemaType,
			event?: BaseSyntheticEvent,
		) {
			try {
				const payload = preparePayload(data);
				await onSubmit(payload, event);
			} catch (error: any) {
				logErrors(error);

				if (error?.errors) {
					Object.entries(error.errors).forEach(([field, messages]) => {
						const fieldName = field as Path<SchemaType>;
						const messageList = messages as string[];

						setError(fieldName, { type: 'server', message: messageList[0] });
					});
				}
			}
		}

		async function handleReset(event: BaseSyntheticEvent) {
			event.preventDefault();

			const resetValues = fields.reduce((values, field) => {
				values[field.name] = defaultValues[field.name] || '';
				return values;
			}, {} as Partial<SchemaType>);

			reset(resetValues);

			if (resubmitOnReset) {
				onSubmit(resetValues);
			}
		}

		/**
		 * Packs flat data into FormData if it contains binary files.
		 * Otherwise, returns the original object.
		 */
		function preparePayload<T extends Record<string, any>>(
			data: T,
		): T | FormData {
			const containsFile = Object.values(data).some(
				(value) => value instanceof FileList || value instanceof File,
			);

			if (!containsFile) {
				return data;
			}

			const formData = new FormData();

			for (const [key, value] of Object.entries(data)) {
				if (value instanceof FileList) {
					if (value.length > 0) {
						formData.append(key, value[0]);
					}
				} else if (value !== null && value !== undefined) {
					formData.append(key, value as string | Blob);
				}
			}

			return formData;
		}

		useImperativeHandle(ref, () => ({
			setServerErrors(error: ErrorResponse) {
				if (!error || !error.errors) {
					logErrors('Non-validation error received:', error);
					return;
				}

				Object.entries(error.errors).forEach(([field, messages]) => {
					setError(field as Path<SchemaType>, {
						type: 'server',
						message: messages[0],
					});
				});
			},
		}));

		return (
			<form
				name='login'
				onSubmit={handleSubmit(handleOnSubmit, logErrors)}
				onReset={handleReset}
				className={concat(
					'material bg-light! dark:bg-dark! text-black! dark:text-light! fill-dark! dark:fill-light! border-dark! dark:border-light!',
					'w-full h-full max-w-max grid grid-flow-row grid-cols-12 auto-cols-fr auto-rows-min gap-y-4 gap-x-4 rounded-xl overflow-visible',
					className,
				)}
				noValidate
			>
				{featuredImage && (
					<img
						src={featuredImage.src}
						className={featuredImage.className}
					/>
				)}
				{fields.map((field: FormFieldContract, index: number) => {
					const FieldComponent = FIELD_COMPONENTS[field.type];

					return (
						<FieldComponent
							key={index}
							t={t}
							register={register}
							setValue={setValue}
							watch={watch}
							control={control}
							errors={errors}
							{...DEFAULT_FIELD_PROPS}
							{...(field as any)}
						/>
					);
				})}
				<div className='col-span-12 row-span-1 flex flex-col xs:flex-row justify-end items-stretch sm:items-center content-stretch gap-4 mt-5'>
					{showReset && (
						<PrimaryButton
							type='reset'
							label='buttons.reset'
							disabled={isValidating || isSubmitting}
						/>
					)}
					{showSubmit && submitButtonText && (
						<PrimaryButton
							type='submit'
							label={submitButtonText}
							disabled={!isValid || isValidating || isSubmitting}
						/>
					)}
				</div>
			</form>
		);
	},
);

export default Form;
