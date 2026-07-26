import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const useOpenParsedOrderDetailsDrawer = () => {
    const router = useRouter();
    const { push, query, pathname, asPath } = router;

    const handleParsedOrderClick = useCallback(
        async (orderPublicId: string) => {
            const newQuery = { ...query, drawerParsedOrderId: orderPublicId };
            const baseAsPath = asPath.split('?')[0];

            await push({ pathname, query: newQuery }, { pathname: baseAsPath, query: newQuery });
        },
        [query, push, pathname, asPath],
    );

    return { handleParsedOrderClick };
};
