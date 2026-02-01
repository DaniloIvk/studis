import { t } from 'i18next';
import type { ActionProps } from '../../types/Common';
import { concat } from '../../common/helpers';

function Action({ name, icon, action, iconClassName = '' }: ActionProps) {
	const Icon = icon;

	return (
		<button
			type='button'
			onClick={(event) => {
				event.stopPropagation();
				action();
			}}
			className='hover:bg-primary! lg:hover:bg-transparent! lg:dark:hover:bg-transparent! active:bg-primary-hover! dark:active:bg-primary-hover! lg:active:bg-transparent! lg:dark:active:bg-transparent! group flex flex-row justify-center items-center content-stretch gap-4 pl-2 pr-4 py-1 lg:p-0 rounded-md lg:rounded-none opacity-80 lg:opacity-60 hover:opacity-100 active:opacity-100 hover:shadow-sm active:shadow-sm cursor-pointer'
		>
			<Icon
				className={concat(
					'w-5 h-5 group-hover:scale-110 group-active:scale-110',
					iconClassName,
				)}
			/>
			{name && (
				<span className='text-dark! dark:text-light! group-hover:text-light! group-active:text-light! bg-transparent! lg:hidden'>
					{t(name)}
				</span>
			)}
		</button>
	);
}

export default Action;
