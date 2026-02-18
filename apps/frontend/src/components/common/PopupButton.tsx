import { t } from 'i18next';
import type { PopupButtonProps } from '../../types/Button';
import { concat, logData } from '../../common/helpers';
import type { ThemeColor } from '../../types/Common';

function PopupButton({
	type = 'button',
	label = '',
	onClick = logData,
	theme = 'primary',
	disabled,
}: PopupButtonProps) {
	const themeColors: Record<ThemeColor, string> = {
		success: 'bg-success! border-success-dark!',
		warn: 'bg-warn! border-warn-dark!',
		error: 'bg-error! border-error-dark!',
		critical: 'bg-danger! border-danger-dark!',
		primary: 'bg-primary! border-primary-dark!',
		neutral: 'bg-neutral! border-neutral-dark!',
	};

	return (
		<button
			type={type}
			onClick={onClick}
			className={concat(
				'text-light leading-10 px-4 rounded-full font-bold border-b-4 transition-all',
				'hover:border-b-2 hover:mt-[2px] active:border-b-0 active:mt-[4px] cursor-pointer disabled:cursor-not-allowed',
				themeColors[theme],
			)}
			disabled={disabled}
		>
			{t(label)}
		</button>
	);
}

export default PopupButton;
