import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useIsAdminPage } from '@hooks';

export const useIsOrdersPage = () => {
    const router = useRouter();
    const isAdminPage = useIsAdminPage();

    const [isOrdersPage, setIsOrdersPage] = useState(true);

    useEffect(() => {
        const handleRouteChangeStart = (url: string) => {
            const cleanUrl = url.split('?')[0];
            const segments = cleanUrl.startsWith('/') ? cleanUrl.substring(1).split('/') : cleanUrl.split('/');
            const adminOrdersIndex = segments.findIndex(segment => segment === 'carrier' || segment === 'shipper');
            const ordersIndex = segments.findIndex(segment => segment === 'orders');
            const relevantIndex = isAdminPage ? adminOrdersIndex : ordersIndex;
            const isLeavingOrdersPage = segments.length > relevantIndex + 1;

            if (isLeavingOrdersPage) {
                setIsOrdersPage(false);
            }
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
        };
    }, [router, isAdminPage]);

    return isOrdersPage;
};
