import { useMemo } from 'react';
import { useRouter } from 'next/router';

export const useIsCarriersCatalogPage = () => {
    const router = useRouter();
    const isCarriersCatalogPage = useMemo(() => router.asPath.includes('/catalogs/carriers'), [router.asPath]);

    return { isCarriersCatalogPage };
};

export const useIsDispatchersCatalogPage = () => {
    const router = useRouter();
    const isDispatchersCatalogPage = useMemo(() => router.asPath.includes('/catalogs/dispatchers'), [router.asPath]);

    return { isDispatchersCatalogPage };
};

export const useIsDriversCatalogPage = () => {
    const router = useRouter();
    const isDriversCatalogPage = useMemo(() => router.asPath.includes('/catalogs/drivers'), [router.asPath]);

    return { isDriversCatalogPage };
};
