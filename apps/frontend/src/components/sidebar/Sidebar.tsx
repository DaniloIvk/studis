import SidebarItems from './SidebarItems';
import Logo from '../../assets/images/Logo.png';
import ThemeSwitcher from './ThemeSwitcher';
import type { SidebarProps } from '../../types/Sidebar';
import { useAuth } from '../../core/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Sidebar({ items = [] }: SidebarProps) {
	const { logout, user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<nav className='material bg-primary-light dark:bg-primary-dark text-light! dark:text-black fill-light min-w-64 max-w-64 h-full hidden md:flex flex-col transition-colors! duration-200! overflow-clip select-none'>
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

			{user && (
				<div className='px-4 py-3 border-t border-dark/10 dark:border-light/10'>
					<p className='text-sm mb-2'>
						{user.firstName} {user.lastName}
					</p>
					<button
						onClick={handleLogout}
						className='w-full! px-3! py-2! bg-red-500/65! text-light! rounded hover:bg-red-600/65! text-sm!'
					>
						Logout
					</button>
				</div>
			)}
			<ThemeSwitcher />
		</nav>
	);
}

export default Sidebar;
