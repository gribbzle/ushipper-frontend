import { isString } from '@/shared';
// TODO: Investigate the import timing issue with `translateByNamespace` —
// calling it at the top level might execute before `i18next` is initialized during SSR.
import { translateByNamespace } from '@/utils/i18n';
import { FieldValidator } from '@/validators/types';

const t = translateByNamespace('common:validators');

export const expiryValidator =
    (errorMessage?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (value.length !== 7) {
            return errorMessage || t('expiry-length');
        }

        const regex = /^(0[1-9]|1[0-2])\/(\d{4})$/;
        const match = value.match(regex);

        if (!match) {
            return errorMessage || t('expiry-format', { format: 'MM/YYYY' });
        }

        const month = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return errorMessage || t('expiry-past');
        }

        return null;
    };
