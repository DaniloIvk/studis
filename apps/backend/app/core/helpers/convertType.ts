/**
 * Try to convert the given value to a number.
 */
export function transformToNumber(value: unknown): number | undefined {
	try {
		value = Number(value);

		return isNaN(value as number) ? undefined : (value as number);
	} catch (error: unknown) {
		return undefined;
	}
}

/**
 * Try to convert the given value to a string.
 */
export function transformToString(value: unknown): string | undefined {
	try {
		return String(value);
	} catch (error: unknown) {
		return undefined;
	}
}

export function transformToDate(value: unknown): Date | undefined {
	try {
		return new Date(value as any);
	} catch (error: unknown) {
		return undefined;
	}
}
