import { KeyboardEvent } from 'react';

export const formatToCurrency = (num = 0) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const formatMetersToMiles = (meters: number) => {
    const coefficient = 0.621371;

    const roundedMiles = Math.round((meters / 1000) * coefficient);

    const formattedMiles = roundedMiles.toLocaleString('en-US');

    return `${formattedMiles} mi`;
};

export const formatToOneDecimal = (value: number | null) => {
    if (value === null || value === undefined) return null;

    return value.toFixed(1);
};

export const formatToOneDecimalPercentage = (value: number) => {
    return `${formatToOneDecimal(value)}%`;
};

export const checkIfValidNumberInput = (event: KeyboardEvent) => {
    const allowedCharacter = /^(\d*([.])?\d*)$|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/;

    return !event.key.match(allowedCharacter) && event.preventDefault();
};

export const numberWithCommas = (value = 0) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const convertAmountToCurrency = (amount?: string) => formatToCurrency(parseInt(amount ?? '0', 10) / 100);

export const convertPriceToCurrency = (amount: string | number) => {
    if (typeof amount === 'number') {
        return formatToCurrency(amount / 100);
    }

    return formatToCurrency(parseInt(amount, 10) / 100);
};
