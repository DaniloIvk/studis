import SidebarItems from './SidebarItems';
import Logo from '../../assets/images/Logo.png';
import ThemeSwitcher from './ThemeSwitcher';
import type { SidebarProps } from '../../types/Sidebar';

function Sidebar({ items = [] }: SidebarProps) {
	return (
		<nav className='material bg-primary-light dark:bg-primary-dark text-dark dark:text-black fill-dark dark:fill-black min-w-64 max-w-64 h-full hidden md:flex flex-col overflow-clip select-none'>
			<img
				src={Logo}
				alt='Logo'
				loading='lazy'
				className='p-14 place-self-center dark:opacity-75'
			/>
			<SidebarItems
				items={items}
				className='flex-1 px-2 overflow-x-clip overflow-y-auto'
			/>
			<ThemeSwitcher />
		</nav>
	);
}

export default Sidebar;
