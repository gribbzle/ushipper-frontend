import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { TabItemBase } from '@/components/common';
import { OfferStatusesEnum } from '@/enums';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetJobOfferQuery } from '@store/api/job-offers';
import { isNotificationsDrawerOpenSelector } from '@store/common';

import { OfferTabsEnum } from '../../offers/offer-drawer/offer-drawer';

export const useViewJobOfferDrawer = () => {
    const isDrawerOpened = useAppSelector(isNotificationsDrawerOpenSelector);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleCloseDrawer = useCallback(async () => {
        await router.push(router.pathname, router.asPath.split('?')[0]);
    }, [router]);

    const { data: jobOffer } = useGetJobOfferQuery(router.query.drawerJobOfferId as string, { skip: !router.query.drawerJobOfferId });

    const [selectedTab, setSelectedTab] = useState(OfferTabsEnum.details);

    const onSelectTabHandler = useCallback(
        (tab: TabItemBase) => {
            setSelectedTab(tab.value as OfferTabsEnum);
        },
        [setSelectedTab],
    );

    useEffect(() => {
        if (router.query.tab) {
            setSelectedTab(router.query.tab as OfferTabsEnum);
        }
    }, [router.query.tab]);

    const hideActions = useMemo(() => jobOffer?.status === OfferStatusesEnum.NEW && selectedTab === OfferTabsEnum.details, [selectedTab, jobOffer]);

    return {
        router,
        jobOffer,
        isDrawerOpened,
        selectedTab,
        hideActions,
        onSelectTabHandler,
        handleCloseDrawer,
        dispatch,
    };
};
