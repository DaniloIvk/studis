import { concat } from '../../common/helpers';
import {
	isSidebarButton,
	isSidebarDropdown,
	isSidebarLabel,
	type SidebarItem,
} from '../../types/Sidebar';
import SidebarDropdown from './SidebarDropdown';
import SidebarButton from './SidebarItem';
import SidebarLabel from './SidebarLabel';

interface SidebarListProps {
	items: SidebarItem[];
	className?: string;
}

function SidebarItems({ items, className = '' }: SidebarListProps) {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<div
			className={concat('w-full flex flex-col gap-1 scrollbar-hide', className)}
		>
			{items.map((item, index) => {
				switch (true) {
					case isSidebarLabel(item):
						return (
							<SidebarLabel
								key={index}
								item={item}
							/>
						);
					case isSidebarButton(item):
						return (
							<SidebarButton
								key={index}
								item={item}
							/>
						);
					case isSidebarDropdown(item):
						return (
							<SidebarDropdown
								key={index}
								item={item}
							/>
						);
				}
			})}
		</div>
	);
}

export default SidebarItems;
