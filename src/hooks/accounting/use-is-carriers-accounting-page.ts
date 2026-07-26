import { useMemo } from 'react';
import { useRouter } from 'next/router';

export const useIsCarriersAccountingBalancePage = () => {
    const { pathname } = useRouter();

    return useMemo(() => pathname.includes('carriers'), [pathname]);
};
