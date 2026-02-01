import { t } from 'i18next';
import Icons from '../../common/Icons';
import { useState } from 'react';
import SidebarItems from './SidebarItems';
import type { SidebarDropdownProps } from '../../types/Sidebar';
import { concat } from '../../common/helpers';

function SidebarDropdown({ item }: { item: SidebarDropdownProps }) {
	const [isOpen, setIsOpen] = useState(false);

	function toggleOpen() {
		setIsOpen((prev) => !prev);
	}

	return (
		<div className='w-full flex flex-col items-start'>
			<button
				onClick={toggleOpen}
				className='hover:bg-primary! w-full flex flex-row items-center justify-between px-3 py-2 cursor-pointer rounded-md transition-colors! duration-200! group'
			>
				<div className='flex flex-row items-center gap-3'>
					<item.icon className='w-5 h-5 transition-transform! duration-200! group-hover:scale-110' />
					<span className='font-medium text-start'>{t(item.label)}</span>
				</div>
				<Icons.ArrowDropDown
					className={concat(
						'w-5 h-5 transition-transform! duration-300! ease-in-out',
						isOpen ? 'rotate-180' : 'rotate-0',
					)}
				/>
			</button>

			<div
				className={concat(
					'grid w-full transition-[grid-template-rows,opacity]! duration-300! ease-in-out',
					isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
				)}
			>
				<div className='overflow-hidden'>
					<div className='border-dark/50! border-l flex flex-col ml-[calc(var(--spacing)*6-2px)] pl-2'>
						<SidebarItems items={item.items!} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default SidebarDropdown;
