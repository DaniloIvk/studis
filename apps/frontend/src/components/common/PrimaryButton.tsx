import { t } from 'i18next';
import type { ButtonProps } from '../../types/Button';
import { logData } from '../../common/helpers';

function PrimaryButton({
	type = 'button',
	label = '',
	onClick = logData,
	disabled,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className='bg-primary! hover:bg-primary-hover! disabled:bg-neutral! text-light! leading-10 px-4 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed'
			disabled={disabled}
		>
			{t(label)}
		</button>
	);
}

export default PrimaryButton;
