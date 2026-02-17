import type { PopupButtonProps, PopupCardProps } from '../../types/Button';
import { concat, logData } from '../../common/helpers';

function PopupCard({
	type = 'button',
	onClick = logData,
	theme = 'primary',
	disabled,
	children,
}: PopupCardProps) {
	const themeColors: Record<PopupButtonProps['theme'] & string, string> = {
		success: 'bg-success border-success-dark',
		warn: 'bg-warn border-warn-dark',
		error: 'bg-error border-error-dark',
		critical: 'bg-critical border-critical-dark',
		primary: 'bg-primary border-primary-dark',
		neutral: 'bg-neutral border-neutral-dark',
	};

	return (
		<button
			type={type}
			onClick={onClick}
			className={concat(
				'text-light flex flex-col items-center text-center group p-8 rounded-3xl font-bold border-b-6 transition-all',
				'hover:border-b-3 hover:mt-[3px] active:border-b-0 active:mt-[6px] cursor-pointer disabled:cursor-not-allowed',
				'duration-200 ease-in-out animate-fade-in-up opacity-0',
				themeColors[theme],
			)}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

export default PopupCard;
