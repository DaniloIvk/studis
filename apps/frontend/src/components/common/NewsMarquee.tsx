import { useTranslation } from 'react-i18next';

function NewsMarquee() {
	const { t } = useTranslation();
	const news = [
		t('news-marquee.art_club'),
		t('news-marquee.exam_registration'),
		t('news-marquee.new_books'),
		t('news-marquee.soccer_tryouts'),
	];

	return (
		<section className='w-full bg-primary/10 border-y-4 border-primary/30 py-4 overflow-hidden relative'>
			<div className='flex w-max animate-marquee'>
				{/* Tripliramo niz kako bismo imali savršen beskonačan loop */}
				{[...news, ...news, ...news].map((item, index) => (
					<div
						key={index}
						className='inline-flex items-center px-8'
					>
						<span className='w-3 h-3 bg-primary rounded-full mr-3 animate-pulse' />
						<span className='text-xl font-bold text-dark dark:text-light'>
							{item}
						</span>
					</div>
				))}
			</div>
			<style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        /* Povećaj sekunde ako želiš da ide sporije */
        .animate-marquee { animation: marquee 35s linear infinite; }
      `}</style>
		</section>
	);
}

export default NewsMarquee;
