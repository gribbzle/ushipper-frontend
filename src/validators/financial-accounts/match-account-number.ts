// TODO: Investigate the import timing issue with `translateByNamespace` —
// calling it at the top level might execute before `i18next` is initialized during SSR.
import { translateByNamespace } from '@/utils/i18n';
import { FieldValidator } from '@/validators/types';

import { isString } from '../../shared/type-guards';

const t = translateByNamespace('common:validators');

export const matchAccountNumber =
    (accountNumber?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return undefined;
        }

        if (accountNumber?.toLowerCase() !== value.toLowerCase()) {
            return t('account-number');
        }

        return undefined;
    };
