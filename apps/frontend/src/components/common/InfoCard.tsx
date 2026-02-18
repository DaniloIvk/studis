import { concat } from '../../common/helpers';
import type { InfoCardProps } from '../../types/Card';
import type { ThemeColor } from '../../types/Common';

function InfoCard({ theme = 'primary', children }: InfoCardProps) {
	const themeColors: Record<ThemeColor, string> = {
		success: 'bg-success! border-success-dark!',
		warn: 'bg-warn! border-warn-dark!',
		error: 'bg-error! border-error-dark!',
		critical: 'bg-danger! border-danger-dark!',
		primary: 'bg-primary! border-primary-dark!',
		neutral: 'bg-neutral! border-neutral-dark!',
	};

	return (
		<div
			className={concat(
				'shadow-neutral dark:shadow-darker **:text-light! **:fill-light! p-8 rounded-3xl border-2 border-b-[6px]',
				'flex flex-col items-center text-center group transition-all duration-300 ease-in-out mt-[3px] hover:mt-0',
				'hover:border-b-[9px] active:mt-0 active:border-b-[9px] animate-fade-in-up opacity-0 cursor-default',
				themeColors[theme],
			)}
		>
			{children}
		</div>
	);
}

export default InfoCard;
