/**
 * Formats a number to a specified number of significant digits.
 * @param num The number to format.
 * @param digits The number of significant digits.
 * @returns The formatted string. Returns an empty string for null/undefined input.
 */
function toSignificantDigits(num: number | null | undefined, digits: number): string {
    if (num === null || num === undefined) {
        return 'N/A';
    }
    return num.toPrecision(digits);
}

/**
 * Formats a number as a percentage with a specified number of significant digits for the base number.
 * @param num The number (e.g., 0.9923) to format.
 * @param digits The number of significant digits for the percentage value.
 * @returns The formatted percentage string (e.g., "99.2%").
 */
function toPercentage(num: number | null | undefined, digits: number): string {
    if (num === null || num === undefined) {
        return 'N/A';
    }
    const percentageValue = num * 100;
    return `${percentageValue.toPrecision(digits)}%`;
}

/**
 * Formats a large number into a more readable string with commas.
 * @param num The number to format.
 * @returns A locale-specific formatted number string.
 */
function withCommas(num: number | null | undefined): string {
    if (num === null || num === undefined) {
        return 'N/A';
    }
    return num.toLocaleString();
}

export const format = {
    sig: toSignificantDigits,
    pct: toPercentage,
    com: withCommas
};