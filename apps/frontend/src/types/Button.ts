import type { BaseSyntheticEvent, PropsWithChildren } from 'react';

export type ButtonProps = {
	readonly type?: 'button' | 'submit' | 'reset';
	readonly label?: string;
	readonly disabled?: boolean;
	readonly onClick?: (event: BaseSyntheticEvent) => any;
};

export type PopupButtonProps = ButtonProps & {
	readonly theme?:
		| 'success'
		| 'warn'
		| 'error'
		| 'critical'
		| 'primary'
		| 'neutral';
};

export type PopupCardProps = PopupButtonProps & PropsWithChildren;
