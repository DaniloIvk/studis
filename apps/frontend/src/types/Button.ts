import type { BaseSyntheticEvent } from 'react';

export type ButtonProps = {
	readonly type?: 'button' | 'submit' | 'reset';
	readonly label?: string;
	readonly disabled?: boolean;
	readonly onClick?: (event: BaseSyntheticEvent) => any;
};
