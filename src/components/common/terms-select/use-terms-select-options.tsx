import { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { PaymentTerm } from '@/enums';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:payment-terms');

export const useTermsSelectOptions = (showOptionAll?: boolean, valueAll?: any) => {
    return useMemo(() => {
        const options = Object.values(PaymentTerm).map(type => ({
            label: t(toKebabCase(type)),
            value: type,
        }));

        if (showOptionAll) {
            options.unshift({
                value: valueAll,
                label: t('all'),
            });
        }

        return options;
    }, [valueAll, showOptionAll]);
};
