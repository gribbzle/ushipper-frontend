import { useMemo } from 'react';
import { useRouter } from 'next/router';

export const useIsTransactionsPage = () => {
    const { pathname } = useRouter();

    return useMemo(() => pathname.includes('transactions'), [pathname]);
};
