import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';

export const useJobOfferActions = (jobOfferPublicId?: string) => {
    const router = useRouter();

    const handleOpenViewJobOfferDrawer = useCallback(
        async (tab: OfferTabsEnum) => {
            if (jobOfferPublicId) {
                await router.push(
                    {
                        pathname: router.pathname,
                        query: {
                            drawerJobOfferId: jobOfferPublicId,
                            tab,
                        },
                    },
                    {
                        pathname: router.asPath,
                        query: {
                            drawerJobOfferId: jobOfferPublicId,
                            tab,
                        },
                    },
                );
            }
        },
        [router, jobOfferPublicId],
    );

    return {
        handleOpenViewJobOfferDrawer,
    };
};
