import { cardNumber } from 'card-validator/dist/card-number';
import i18next from 'i18next';

import { isString } from '@/shared';

import { FieldValidator } from './types';

export const cardNumberValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        const cleanValue = value.replace(/\s+/g, '');

        const validation = cardNumber(cleanValue);

        if (!validation.isValid) {
            if (!validation.isPotentiallyValid) {
                if (cleanValue.length < 13 || cleanValue.length > 16) {
                    return errorMessage || i18next.t('common:validators.range-length', { min: 13, max: 16 });
                }
            }

            return errorMessage || i18next.t('common:validators.invalid-card-number');
        }

        return null;
    };
