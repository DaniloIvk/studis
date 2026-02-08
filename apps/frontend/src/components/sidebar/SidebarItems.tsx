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
import { useAuth } from '../../core/context/AuthContext';
import Role from '../../enums/Role';

interface SidebarListProps {
	items: SidebarItem[];
	className?: string;
}

function SidebarItems({ items, className = '' }: SidebarListProps) {
	const { user } = useAuth();

	if (!items || items.length === 0) {
		return null;
	}

	const filteredItems = items.filter((item) => {
		if (!item.role) return true;

		if (!user?.role) return false;

		if (Array.isArray(item.role)) {
			return item.role.some(role => String(role) === user.role);
		}

		if (item.role === Role.cases) return true;

		return String(item.role) === user.role;
	});

	return (
		<div
			className={concat('w-full flex flex-col gap-1 scrollbar-hide', className)}
		>
			{filteredItems.map((item, index) => {
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