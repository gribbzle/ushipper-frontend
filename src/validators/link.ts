import i18next from 'i18next';

import { isString } from '@/shared';

import { FieldValidator } from './types';

const linkPattern =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

export const linkValidator: FieldValidator = value => {
    if (!value || !isString(value)) {
        return null;
    }

    return linkPattern.test(value) ? null : i18next.t('common:validators.link');
};
