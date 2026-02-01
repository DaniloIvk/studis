import { t } from 'i18next';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <h2 className='text-4xl leading-16 px-6'>404</h2>
      <p className='leading-6 px-2'>{t('404_message')}</p>
      <Link to='/' className='hover:opacity-80 underline leading-16 px-6'>
        {t('back_to_homepage')}
      </Link>
    </div>
  );
}

export default NotFound;
