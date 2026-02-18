import type { BaseSyntheticEvent, PropsWithChildren } from 'react';
import type { ThemeColor } from './Common';

export type ButtonProps = {
	readonly type?: 'button' | 'submit' | 'reset';
	readonly label?: string;
	readonly disabled?: boolean;
	readonly onClick?: (event: BaseSyntheticEvent) => any;
};

export type PopupButtonProps = ButtonProps & { readonly theme?: ThemeColor };

export type PopupCardProps = PopupButtonProps & PropsWithChildren;
