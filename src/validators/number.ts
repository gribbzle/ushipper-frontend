import i18next from 'i18next';

import { isString } from '../shared/type-guards';

import { FieldValidator } from './types';

export const numberValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (!/^[0-9]*$/gi.test(value)) {
            return errorMessage || 'The field can only contain numbers';
        }

        return null;
    };

export const usDotValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (!/^[0-9]*$/gi.test(value)) {
            return errorMessage || 'The field can only contain numbers';
        }

        if (parseInt(value) < 0 || parseInt(value) > 2147483647) {
            return errorMessage || 'The field must be between 0 and 2147483647';
        }

        return null;
    };

export const taxIdValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (value.replace(/\D/g, '').length !== 9) {
            return errorMessage || i18next.t('common:validators.tax-id');
        }

        return null;
    };

export const lengthValidator =
    (min: number, max: number): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        const lengthOfValue = value.length;

        if (lengthOfValue < min || lengthOfValue > max) {
            return i18next.t('common:validators.range-length', { min, max });
        }

        return null;
    };

export const positiveNumberValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        const numericValue = parseFloat(value);

        if (isNaN(numericValue) || numericValue <= 0) {
            return errorMessage || i18next.t('common:validators.positive-number');
        }

        return null;
    };
