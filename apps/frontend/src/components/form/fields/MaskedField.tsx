import { useState } from 'react';
import type { MaskedFieldProps } from '../../../types/Common';
import Icons from '../../../common/Icons';
import Message from '../Message';
import Label from './Label';

function MaskedField({
	name,
	label,
	autoComplete,
	register,
	errors,
	className = '',
	disabled = false,
	readOnly = false,
}: MaskedFieldProps) {
	const [valueVisibility, setValueVisibility] = useState<boolean>(false);

	const Icon = valueVisibility ? Icons.VisibilityOff : Icons.Visibility;

	function togglePasswordVisibility() {
		setValueVisibility((prev) => !prev);
	}

	return (
		<Label
			text={label}
			className={className}
		>
			<div className='non-material bg-dark/5! dark:bg-light/15! rounded-md flex items-center'>
				<input
					type={valueVisibility ? 'text' : 'password'}
					autoComplete={autoComplete}
					autoCapitalize='off'
					className='w-full text-ellipsis text-nowrap pr-0!'
					disabled={disabled}
					readOnly={readOnly}
					{...register(name)}
				/>

				<button
					type='button'
					onClick={togglePasswordVisibility}
					className='px-4 leading-[2.5em] cursor-pointer'
				>
					<Icon className='w-4' />
				</button>
			</div>

			{errors[name] && (
				<Message
					text={`${errors[name]?.message}`}
					variant='error'
				/>
			)}
		</Label>
	);
}

export default MaskedField;
