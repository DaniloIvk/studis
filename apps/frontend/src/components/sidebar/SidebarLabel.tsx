import { t } from 'i18next';
import { SidebarLabelProps } from '../../types/Sidebar';

function SidebarLabel({ item }: { item: SidebarLabelProps }) {
	return (
		<div className='w-full'>
			<button className='hover:bg-primary! w-full flex flex-row items-center gap-3 px-3 py-2 cursor-pointer rounded-md transition-colors! duration-200! group'>
				<span className='font-medium text-start'>{t(item.label)}</span>
			</button>
		</div>
	);
}

export default SidebarLabel;
