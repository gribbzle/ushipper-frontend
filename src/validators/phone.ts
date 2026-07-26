import i18next from 'i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { isString } from '@/shared';

import { FieldValidator } from './types';

export const phoneValidator: FieldValidator = value => {
    if (!value || !isString(value)) {
        return undefined;
    }

    return isValidPhoneNumber(value, 'US') ? undefined : i18next.t('common:validators.phone-number');
};
