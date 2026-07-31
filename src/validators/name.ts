import i18next from 'i18next';

import { isString } from '../shared/type-guards';

import { FieldValidator } from './types';

export const nameValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (!/^([a-z\-]+)$/gi.test(value)) {
            return errorMessage || i18next.t('common:validators.name');
        }

        return null;
    };

export const companyNameValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (!/^[a-z]+(?:[\s.-][a-z]+)*$/gi.test(value)) {
            return errorMessage || i18next.t('common:validators.name-with-spaces');
        }

        return null;
    };

export const nameWithSpacesValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (!/^([a-zа-яА-Я0-9\-\s]+)$/gi.test(value)) {
            return errorMessage || i18next.t('common:validators.name-with-numbers-spaces');
        }

        return null;
    };
