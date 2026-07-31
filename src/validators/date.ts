import { isAfter, isBefore, isToday, startOfDay } from 'date-fns';
import i18next from 'i18next';

import { isString } from '../shared/type-guards';

import { FieldValidator } from './types';

export const validateDateNotBeforeToday =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        const currentDate = startOfDay(new Date());
        const parsedDate = new Date(value);

        if (isNaN(parsedDate.getTime())) {
            return errorMessage || i18next.t('common:validators.invalid-date');
        }

        if (isToday(parsedDate) || !isAfter(parsedDate, currentDate)) {
            return errorMessage || i18next.t('common:validators.date-not-after-today');
        }

        return null;
    };

export const validateDateBeforeToday =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        const currentDate = startOfDay(new Date());
        const parsedDate = new Date(value);

        if (isNaN(parsedDate.getTime())) {
            return errorMessage || i18next.t('common:validators.invalid-date');
        }

        if (!isBefore(parsedDate, currentDate)) {
            return errorMessage || i18next.t('common:validators.date-not-before-today');
        }

        return null;
    };
