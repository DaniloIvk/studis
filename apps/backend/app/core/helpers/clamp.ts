/**
 * Clamp the given number to be within the given limits.
 */
export function clamp(number: number, limit1: number, limit2: number): number {
	const min = Math.min(limit1, limit2);
	const max = Math.max(limit1, limit2);

	return Math.min(max, Math.max(min, number));
}
