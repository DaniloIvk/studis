import type { FunctionComponent, SVGProps } from 'react';
import type { CaseType } from '../enums/Theme';
import Icons from '../common/Icons';
import Theme from '../enums/Theme';

interface ThemeContract {
  key: CaseType;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

const Themes: ThemeContract[] = [
  {
    key: Theme.LIGHT,
    icon: Icons.ThemeLight,
  },
  {
    key: Theme.DARK,
    icon: Icons.ThemeDark,
  },
  {
    key: Theme.SYSTEM,
    icon: Icons.ThemeSystem,
  },
];

export default Themes;
