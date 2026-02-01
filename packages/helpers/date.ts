/**
 * - Formatting options:
 *  - `d` - day (one digit)
 *  - `D` - day (two digit)
 *  - `m` - month (one digit)
 *  - `M` - month (two digit)
 *  - `y` - year (two digit)
 *  - `Y` - year (four digit)
 *  - `h` - hours (one digit)
 *  - `h` - hours (two digit)
 *  - `i` - minutes (two digit)
 *  - `I` - minutes (one digit)
 *  - `s` - seconds (two digit)
 *  - `S` - seconds (one digit)
 *  - `u` - milliseconds (three digit)
 */
export function formatDate(date: Date | string, format: string): string {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	const formatters: Record<string, () => string> = {
		d: () => date.getDate().toString(),
		D: () => date.getDate().toString().padStart(2, '0'),
		m: () => (date.getMonth() + 1).toString(),
		M: () => (date.getMonth() + 1).toString().padStart(2, '0'),
		y: () => (date.getFullYear() % 100).toString().padStart(2, '0'),
		Y: () => date.getFullYear().toString(),
		h: () => date.getHours().toString(),
		H: () => date.getHours().toString().padStart(2, '0'),
		i: () => date.getMinutes().toString().padStart(2, '0'),
		I: () => date.getMinutes().toString(),
		s: () => date.getSeconds().toString().padStart(2, '0'),
		S: () => date.getSeconds().toString(),
		u: () => date.getMilliseconds().toString(),
	};

	return format
		.split('')
		.map((character: string) =>
			formatters[character] ? formatters[character]() : character,
		)
		.join('');
}

/**
 * Generates a placeholder string based on the format characters.
 * e.g., "D.M.Y" -> "--.-.----"
 */
export function generateDatePlaceholder(format: string): string {
	const placeholders: Record<string, string> = {
		d: '-',
		D: '--',
		m: '-',
		M: '--',
		y: '--',
		Y: '----',
		h: '-',
		H: '--',
		i: '--',
		I: '-',
		s: '--',
		S: '-',
		u: '---',
	};

	return format
		.split('')
		.map((char: string) => placeholders[char] ?? char)
		.join('');
}

/**
 * Check if the two dates are on same day or not.
 */
export function dateCompare(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}
