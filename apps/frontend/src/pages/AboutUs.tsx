import { useTranslation } from 'react-i18next';
import Icons from '../common/Icons';
import InfoCard from '../components/common/InfoCard';
import type { ThemeColor } from '../types/Common';

type InfoCard = {
	title: string;
	description: string;
	icon: React.ReactNode;
	theme: ThemeColor;
};

function AboutUs() {
	const { t } = useTranslation();

	const infoCards: InfoCard[] = [
		{
			title: t('about.mission_title'),
			description: t('about.mission_description'),
			icon: <Icons.Dashboard className='w-12 h-12' />,
			theme: 'primary',
		},
		{
			title: t('about.tech_stack_title'),
			description: t('about.tech_stack_description'),
			icon: <Icons.Colors className='w-12 h-12' />,
			theme: 'warn',
		},
		{
			title: t('about.credits_title'),
			description: t('about.credits_description'),
			icon: <Icons.Info className='w-12 h-12' />,
			theme: 'success',
		},
	];

	return (
		<div className='bg-light! dark:bg-dark! text-dark! dark:text-light! flex flex-col justify-start items-center content-stretch gap-6 w-full h-full overflow-y-auto transition-colors duration-500 py-12 px-6 lg:px-32'>
			<div className='flex flex-col justify-center items-center content-center gap-4'>
				<div className='text-primary! inline-flex items-center justify-center'>
					<Icons.Info className='w-10 h-10' />
				</div>
				<h1 className='text-5xl md:text-6xl font-extrabold mb-4 leading-tight'>
					{t('about.title')}
				</h1>
				<p className='text-xl opacity-70 max-w-2xl mx-auto font-medium'>
					{t('about.subtitle')}
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{infoCards.map((card, index) => (
					<InfoCard
						key={index}
						theme={card.theme}
					>
						<div className='mb-6'>{card.icon}</div>
						<h2 className='text-2xl font-bold mb-4'>{card.title}</h2>
						<p className='text-base opacity-90 font-medium leading-relaxed'>
							{card.description}
						</p>
					</InfoCard>
				))}
			</div>

			<div className='border-light-gray! dark:border-darker! w-full mt-auto pt-10 border-t-2 text-center animate-fade-in-up opacity-0'>
				<p className='opacity-50 font-medium text-sm'>
					&copy; {new Date().getFullYear()} {t('about.copyright')}
				</p>
			</div>
		</div>
	);
}

export default AboutUs;
