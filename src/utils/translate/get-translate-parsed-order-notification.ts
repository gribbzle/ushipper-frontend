import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('client:loadboard:notifications');

const getTranslation = (error?: string): string | null => {
    if (!error) {
        return null;
    }

    const key = toKebabCase(error.toLowerCase());
    const translatedMessage = t(key);

    return translatedMessage === `loadboard.notifications.${key}` ? null : translatedMessage;
};

export const getTranslateParsedOrderNotification = ({ defaultMessage, error }: { defaultMessage: string; error?: string }): string =>
    getTranslation(error) || defaultMessage;
