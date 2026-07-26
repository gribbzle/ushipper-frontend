import { useCallback } from 'react';
import cleanDeep from 'clean-deep';

import { TransactionsFiltersState } from '@types';

export const useOpenTransactionsPage = () => {
    return useCallback((params?: Partial<TransactionsFiltersState>) => {
        const cleanedParams = cleanDeep(params ?? {});

        const query = Object.entries(cleanedParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const url = `/admin/accounting/transactions${query ? `?${query}` : ''}`;

        window.open(url, '_blank');
    }, []);
};
