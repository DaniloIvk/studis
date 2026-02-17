import { t } from 'i18next';
import type { ButtonProps } from '../../types/Button';
import { logData } from '../../common/helpers';

function OutlineButton({
	type = 'button',
	label = '',
	onClick = logData,
	disabled,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className='border-primary! hover:border-primary-hover! disabled:border-neutral! text-light! border-2 leading-10 px-4 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed'
			disabled={disabled}
		>
			{t(label)}
		</button>
	);
}

export default OutlineButton;
