import type { FunctionComponent, ReactElement, SVGProps } from 'react';
import HasRole from '../traits/HasRoles';

export class SidebarLabelProps extends HasRole {
	public readonly label!: string;
}

export class SidebarButtonProps extends HasRole {
	public readonly path!: string;
	public readonly label!: string;
	public readonly icon!: FunctionComponent<SVGProps<SVGSVGElement>>;
	public readonly component!: () => ReactElement;
}

export class SidebarDropdownProps extends HasRole {
	public readonly label!: string;
	public readonly icon!: FunctionComponent<SVGProps<SVGSVGElement>>;
	public readonly items!: SidebarItem[];
}

export class SidebarProps {
	public readonly items!: SidebarItem[];
}

export type SidebarItem =
	| SidebarLabelProps
	| SidebarButtonProps
	| SidebarDropdownProps;

function is(item: any, template: any): boolean {
	const itemKeys = Object.keys(item);
	const templateKeys = Object.keys(template);

	if (itemKeys.length !== templateKeys.length) {
		return false;
	}

	for (const key of itemKeys) {
		if (!Object.prototype.hasOwnProperty.call(template, key)) {
			return false;
		}
	}

	return true;
}

export function isSidebarLabel(item: SidebarItem): item is SidebarLabelProps {
	return is(item, new SidebarLabelProps());
}

export function isSidebarButton(item: SidebarItem): item is SidebarButtonProps {
	return is(item, new SidebarButtonProps());
}

export function isSidebarDropdown(
	item: SidebarItem,
): item is SidebarDropdownProps {
	return is(item, new SidebarDropdownProps());
}
