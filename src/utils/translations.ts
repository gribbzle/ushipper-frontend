import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';
import { MapboxStyle } from '@components';
import { RegistrationType } from '@enums';

const t = translateByNamespace('common');
const translateValue = translateByNamespace('common:translate-value');

export const translateSortingOption = (name: string) => t(`sorting-options:${toKebabCase(name)}`);

export const translateRegistrationType = (type: RegistrationType) => t(`registration-types:${toKebabCase(type)}`);

export const translatePaymentMethod = (method: string) => t(`payment-terms:${toKebabCase(method)}`);

export const translateCompanyType = (companyType: string) => t(`company-types:${companyType}`);

export const translateBooleanOrFormatValue = (rawValue: any, useActiveBlockedValue = false): string | number => {
    if (typeof rawValue === 'boolean') {
        return rawValue
            ? useActiveBlockedValue
                ? translateValue('active-value')
                : translateValue('yes-value')
            : useActiveBlockedValue
            ? translateValue('blocked-value')
            : translateValue('no-value');
    }

    return rawValue ?? translateValue('empty-value');
};

export const translateMapBoxStyle = (style: MapboxStyle) => t(`enums:mapboxStyles:${style}`);
