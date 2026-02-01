import { t } from 'i18next';
import type { FormLabelProps } from '../../../types/Common';
import type { BaseSyntheticEvent } from 'react';
import { concat } from '../../../common/helpers';

function Label({ text, children, className = '' }: FormLabelProps) {
	function handleLabelClick(event: BaseSyntheticEvent): void {
		event.stopPropagation();
		event.preventDefault();
	}

	return (
		<label
			className={concat(
				'relative w-full h-min self-start flex flex-col justify-between items-stretch content-stretch text-pretty wrap-anywhere',
				className,
			)}
		>
			{text && (
				<span
					onClick={handleLabelClick}
					className='text-sm mb-2 capitalize select-none'
				>
					{t(text)}
				</span>
			)}
			{children ? children : ''}
		</label>
	);
}

export default Label;
