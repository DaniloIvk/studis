import { t } from 'i18next';
import type { SidebarButtonProps } from '../../types/Sidebar';
import { useNavigate } from 'react-router-dom';
import type { BaseSyntheticEvent } from 'react';
import useQuery from '../../hooks/useQuery';
import { concat } from '../../common/helpers';

function SidebarButton({ item }: { item: SidebarButtonProps }) {
	const navigate = useNavigate();
	const query = useQuery();

	function handleRouteChange(event: BaseSyntheticEvent) {
		event.stopPropagation();
		event.preventDefault();

		// Reset query between different pages
		query.use({});

		navigate(item.path, { replace: true, viewTransition: true });
	}

	return (
		<div className='w-full'>
			<button
				onClick={handleRouteChange}
				className='hover:bg-primary! w-full flex flex-row items-center gap-3 px-3 py-2 cursor-pointer rounded-md transition-colors! duration-200! group'
			>
				<item.icon
					className={concat(
						'fill-inherit w-5 h-5 transition-transform! duration-200! group-hover:scale-110',
						item.path === 'users' ? 'scale-120' : '',
					)}
				/>
				<span
					className={concat(
						'text-start',
						item.path === 'users' ? 'font-semibold' : 'font-medium',
					)}
				>
					{t(item.label)}
				</span>
			</button>
		</div>
	);
}

export default SidebarButton;
