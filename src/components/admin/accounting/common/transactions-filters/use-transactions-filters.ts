import { useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { TransactionsFiltersState } from '@types';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:filters');

export const useTransactionsFilters = () => {
    const {
        filters: { createdAtFrom, createdAtTo, reasonCompanyId, reasonUserId, fundsMovement, status, type, accountId, orderId, typeGroup },
    } = useQueryFilters<TransactionsFiltersState>();

    const handleFiltersChange = useHandleFiltersChange<TransactionsFiltersState>({ resetPageOnChange: true });

    const initialValues = useMemo<TransactionsFiltersState>(
        () => ({ createdAtFrom, createdAtTo, reasonCompanyId, reasonUserId, fundsMovement, status, type, accountId, orderId, typeGroup }),
        [reasonCompanyId, createdAtFrom, createdAtTo, fundsMovement, reasonUserId, status, type, accountId, orderId, typeGroup],
    );

    const extraPaymentConfirmationOptions = [
        {
            label: t('cash-in'),
            value: 'cash-in',
        },
        {
            label: t('cash-out'),
            value: 'cash-out',
        },
    ];

    return {
        initialValues,
        extraPaymentConfirmationOptions,
        handleFiltersChange,
    };
};
