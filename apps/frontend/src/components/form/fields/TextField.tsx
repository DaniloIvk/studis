import type { TextFieldProps } from '../../../types/Common';
import Message from '../Message';
import Label from './Label';

function TextField({
	type,
	name,
	label,
	autoComplete,
	autoCapitalize,
	min,
	max,
	minLength,
	maxLength,
	register,
	errors,
	className = '',
	disabled = false,
	readOnly = false,
}: TextFieldProps) {
	return (
		<Label
			text={label}
			className={className}
		>
			<div className='non-material bg-dark/5! dark:bg-light/15! rounded-md'>
				<input
					type={type}
					autoComplete={autoComplete}
					autoCapitalize={autoCapitalize}
					min={min}
					max={max}
					minLength={minLength}
					maxLength={maxLength}
					className='w-full text-ellipsis text-nowrap'
					disabled={disabled}
					readOnly={readOnly}
					{...register(name)}
				/>
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

export default TextField;
