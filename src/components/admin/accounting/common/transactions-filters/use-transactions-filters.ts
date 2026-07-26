import { useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@/hooks';
import { TransactionsFiltersState } from '@types';
import { translateByNamespace } from '@utils';

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
