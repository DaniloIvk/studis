import { useTranslation } from 'react-i18next';
import { useAuth } from '../core/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icons from '../common/Icons';
import NewsMarquee from '../components/common/NewsMarquee';
import Role from '../enums/Role';
import LogoBig from '../assets/images/LogoBig.png';
import PopupButton from '../components/common/PopupButton';
import PopupCard from '../components/common/PopupCard';
import ThemeSwitcher from '../components/sidebar/ThemeSwitcher';

function Homepage() {
	const { t } = useTranslation();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const getInitials = () => {
		if (!user) return '?';
		const first = user.firstName?.charAt(0) || '';
		const last = user.lastName?.charAt(0) || '';
		return (first + last).toUpperCase();
	};

	const getQuickAccessCards = () => {
		if (!user) return [];

		const userRole = Role.from(user.role)!;

		if (userRole.is(Role.ADMIN)) {
			return [
				{
					title: t('homepage.quick_access.dashboard'),
					description: t('homepage.quick_access.dashboard_description'),
					icon: <Icons.Dashboard className='w-12 h-12' />,
					link: '/dashboard',
					color: 'primary',
					borderColor: 'border-primary',
				},
				{
					title: t('homepage.quick_access.announcements'),
					description: t('homepage.quick_access.announcements_description'),
					icon: <Icons.Notifications className='w-12 h-12' />,
					link: '/announcement',
					color: 'success',
					borderColor: 'border-warn',
				},
				{
					title: t('homepage.quick_access.exam_periods'),
					description: t('homepage.quick_access.exam_periods_description'),
					icon: <Icons.Calendar className='w-12 h-12' />,
					link: '/exam-periods',
					color: 'warn',
					borderColor: 'border-success',
				},
			];
		}

		return [
			{
				title: t('homepage.quick_access.dashboard'),
				description: t('homepage.quick_access.dashboard_description'),
				icon: <Icons.Dashboard className='w-12 h-12' />,
				link: '/dashboard',
				color: 'primary',
				borderColor: 'border-primary',
			},
			{
				title: t('homepage.quick_access.exams'),
				description: t('homepage.quick_access.exams_description'),
				icon: <Icons.Assignment className='w-12 h-12' />,
				link: '/exams',
				color: 'warn',
				borderColor: 'border-success',
			},
			{
				title: t('homepage.quick_access.materials'),
				description: t('homepage.quick_access.materials_description'),
				icon: <Icons.Dictionary className='w-12 h-12' />,
				link: '/materials',
				color: 'success',
				borderColor: 'border-warn',
			},
		];
	};

	const handleLogout = async () => {
		await logout();
		navigate('/login', { replace: true });
	};

	return (
		<div className='bg-light dark:bg-dark text-dark dark:text-light w-full h-full overflow-y-auto transition-colors duration-500'>
			{/* Top Bar */}
			<div className='w-full max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-4 animate-fade-in-up'>
				<div className='fill-dark! dark:fill-light!'>
					<ThemeSwitcher />
				</div>
				{user ?
					<>
						<div className='flex items-center gap-3 p-2 pr-4'>
							<div className='bg-primary text-light w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm'>
								{getInitials()}
							</div>
							<span className='font-bold hidden sm:block'>
								{user.firstName} {user.lastName}
							</span>
						</div>
						<PopupButton
							label={t('buttons.logout')}
							theme='warn'
							onClick={handleLogout}
						/>
					</>
				:	<PopupButton
						label={t('buttons.login')}
						onClick={() => navigate('login', { replace: true })}
					/>
				}
			</div>

			{/* Hero Section */}
			<section className='relative px-6 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
				<div className='animate-fade-in-left opacity-0'>
					<span className='bg-primary/10 text-primary border-primary/20 inline-block text-xl px-5 py-2 font-bold rounded-full mb-6 border-2'>
						{t('homepage.welcome')} ✨
					</span>
					<h1 className='text-5xl md:text-7xl font-extrabold mb-6 leading-tight'>
						{t('homepage.academy_name')}
					</h1>
					<p className='text-xl opacity-80 mb-8 max-w-lg leading-relaxed font-medium'>
						{t('homepage.hero_description')}
					</p>

					<div className='flex gap-4'>
						<PopupButton
							label={t('homepage.enter_portal')}
							onClick={() => navigate('/dashboard', { replace: true })}
						/>
						<PopupButton
							label={t('homepage.about_academy')}
							theme='success'
							onClick={() => navigate('/about-us')}
						/>
					</div>
				</div>

				<div className='hidden lg:flex justify-center relative items-center'>
					<div className='bg-primary/20 w-96 h-96 rounded-full blur-3xl absolute animate-pulse' />
					<img
						src={LogoBig}
						alt={t('app_name')}
						title={t('app_name')}
						className='w-72 h-72 object-contain relative z-10 drop-shadow-2xl animate-fade-in-up select-none'
					/>
				</div>
			</section>

			<NewsMarquee />

			{/* Quick Access */}
			{user && (
				<section className='py-16 px-6 max-w-7xl mx-auto'>
					<div className='mb-10 animate-fade-in-up opacity-0'>
						<h2 className='text-4xl font-extrabold mb-2'>
							{t('homepage.student_portal')}
						</h2>
						<p className='opacity-60 text-lg font-medium'>
							{t('homepage.portal_description')}
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{getQuickAccessCards().map((card, index: number) => (
							<PopupCard
								key={index}
								theme={card.color as any}
								onClick={() => navigate(card.link, { replace: true })}
							>
								<div className='text-dark dark:text-light mb-4 transform'>
									{card.icon}
								</div>
								<h3 className='text-2xl font-bold mb-3'>{card.title}</h3>
								<p className='text-base opacity-80 font-medium'>
									{card.description}
								</p>
							</PopupCard>
						))}
					</div>
				</section>
			)}
		</div>
	);
}

export default Homepage;
