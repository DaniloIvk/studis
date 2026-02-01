import { useEffect, useState } from 'react';
import { t } from 'i18next';
import Icons from '../../common/Icons';
import Theme, { type CaseType } from '../../enums/Theme';
import Themes from '../../config/Themes';
import { useSystemTheme } from './useSystemTheme';
import { concat } from '../../common/helpers';

function ThemeSwitcher() {
	const savedTheme = Number(localStorage.getItem('theme'));
	const systemTheme = useSystemTheme();
	const [selectedTheme, setSelectedTheme] = useState<CaseType>(
		Theme.from(savedTheme) || Theme.SYSTEM,
	);

	function changeTheme(newTheme: CaseType): () => void {
		return () => setSelectedTheme(newTheme);
	}

	useEffect(() => {
		const htmlElement = document.documentElement;

		if (selectedTheme.is(Theme.SYSTEM)) {
			htmlElement.className = `${selectedTheme.stringable()} ${systemTheme.stringable()}`;
		} else {
			htmlElement.className = selectedTheme.stringable().toString();
		}

		localStorage.setItem('theme', selectedTheme.value as string);
	}, [selectedTheme, systemTheme]);

	return (
		<div className='w-full flex flex-row justify-between items-center content-stretch gap-2 p-4 mt-auto'>
			<div className='flex flex-row justify-start items-center content-stretch gap-3'>
				<Icons.Colors className='fill-inherit w-6' />
				<span className='text-inherit'>{t('theme')}</span>
			</div>

			<span className='bg-dark/50! w-px h-full'></span>

			<div className='w-fit flex flex-row justify-evenly items-center content-stretch gap-2'>
				{Themes.map((theme) => (
					<theme.icon
						key={theme.key.value}
						onClick={changeTheme(theme.key)}
						className={concat(
							'fill-inherit w-6 hover:scale-110',
							theme.key.isNot(selectedTheme) && 'opacity-50',
						)}
					/>
				))}
			</div>
		</div>
	);
}

export default ThemeSwitcher;
