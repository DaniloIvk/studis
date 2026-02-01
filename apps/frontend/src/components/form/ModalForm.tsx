import { forwardRef, type ForwardedRef } from 'react';
import { t } from 'i18next';
import Icons from '../../common/Icons';
import type { ForwardedFormProps, ModalFormProps } from '../../types/Form/Form';
import Form from './Form';
import { concat } from '../../common/helpers';

const ModalForm = forwardRef(
	(
		{
			schema,
			onSubmit,
			fields,
			showSubmit = true,
			submitButtonText,
			defaultValues = {},
			featuredImage,
			title,
			size = 'medium',
			hidden,
			setHidden,
			hideCloseButton,
		}: ModalFormProps,
		ref: ForwardedRef<ForwardedFormProps>,
	) => {
		if (hidden === true) {
			return;
		}

		const width = { small: 'max-w-100', medium: 'max-w-150', big: 'max-w-max' }[
			size
		];

		function hide() {
			setHidden?.(true);
		}

		return (
			<div className='non-material bg-black/50! absolute top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col justify-center items-center content-center p-4 z-10'>
				<div
					className={concat(
						'bg-light! dark:bg-dark! flex flex-col justify-center items-center content-stretch rounded-xl',
						width,
					)}
				>
					<div className='bg-light-gray! dark:bg-primary-hover! relative w-full h-fit flex flex-row justify-between items-center content-stretch gap-4 p-4 rounded-t-xl drop-shadow-bottom-md'>
						{title && (
							<span className='w-full ml-10 text-center'>{t(title)}</span>
						)}
						{hideCloseButton !== true && (
							<Icons.Close
								onClick={hide}
								className='bg-dark/5! dark:bg-light/15! hover:bg-dark/7! dark:hover:bg-light/10! active:bg-dark/7! dark:active:bg-light/10! hover:fill-error! active:fill-error! place-self-start w-6 h-6 p-1 rounded-full cursor-pointer'
							/>
						)}
					</div>
					<div className='overflow-visible'>
						<div className='p-8'>
							<Form
								ref={ref}
								schema={schema}
								fields={fields}
								defaultValues={defaultValues}
								showSubmit={showSubmit}
								submitButtonText={submitButtonText}
								onSubmit={onSubmit}
								featuredImage={featuredImage}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

export default ModalForm;
