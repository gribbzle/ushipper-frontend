import i18next from 'i18next';

import { FieldValidator, FieldValidatorArray } from './types';

export const required: FieldValidator = value => (value ? undefined : i18next.t('common:validators.required'));

export const requiredCurrency: FieldValidator = value => (String(value) === '0' || value ? undefined : i18next.t('common:validators.required'));

export const requiredArray: FieldValidatorArray = value => {
    if (!value || value.length === 0 || !value.every(item => typeof item === 'string' || typeof item === 'number')) {
        return i18next.t('common:validators.required');
    }

    return undefined;
};

export const requiredFile = (value: File | File[] | null | undefined) =>
    !value || (Array.isArray(value) && value.length === 0) ? i18next.t('common:validators.required') : undefined;
