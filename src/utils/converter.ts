import Decimal from 'decimal.js';

export const convertBytesToMB = (bytes: number): number => +(bytes / 1024 ** 2).toFixed(2);

export const convertMetersToMiles = (meters: number): number => +(meters / 1609.34).toFixed(3);

export const convertCityToAbbreviation = (value: string) => {
    if (!value) return '';

    const words = value.split(' ');

    if (words.length === 1) {
        return words[0].toUpperCase();
    }

    return words
        .map(word => word[0])
        .join('')
        .toUpperCase();
};

export const convertToStringArray = <T extends string>(value: T[] | T | undefined): T[] => {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};

export const convertDollarsToCents = (value: string | number | undefined | null): number => {
    if (!value) return 0;

    return new Decimal(value).times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
};

export const convertCentsToInteger = (value: string | number | null | undefined): number => {
    if (!value) return 0;

    return new Decimal(value).toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
};

export const convertCentsToDollars = (value: string | number | null | undefined): number => {
    if (!value) return 0;

    return new Decimal(value).div(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
};
