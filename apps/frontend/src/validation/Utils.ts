const ValidationUtils = {
	preprocessStringInputValue(value: string | null | undefined) {
		if (typeof value === 'string') {
			value = value.trim();

			return value === '' ? null : value;
		}

		return value === undefined ? null : value;
	},
	convertValueToString(value: unknown): string | undefined {
		try {
			return value ? String(value) : undefined;
		} catch (error: unknown) {
			return undefined;
		}
	},
	convertValueToNumber(value: unknown): number | undefined {
		try {
			value = Number(value);

			return isNaN(value as number) ? undefined : (value as number);
		} catch (error: unknown) {
			return undefined;
		}
	},
	convertEmptyInputToUndefined(value: unknown): unknown | undefined {
		return value ? value : undefined;
	},
	convertValueToDate(value: unknown) {
		try {
			return value ? new Date(value as any) : undefined;
		} catch (error: unknown) {
			return undefined;
		}
	},
};

export default ValidationUtils;
