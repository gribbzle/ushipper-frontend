import { useMemo } from 'react';

import { TabItemBase } from '@/components/common/tabs/tabs';
import { OffersListTabsEnum } from '@/enums/offers-list-tabs-enum';
import { useMeDispatcher } from '@hooks';
import { OffersStatistic } from '@store/api/order-offers';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order-offers:filters');

export const useJobOffersFiltersTabs = (offersStats: OffersStatistic) => {
    const isDispatcherContext = useMeDispatcher();

    const tabs = useMemo<TabItemBase[]>(() => {
        return Object.values(OffersListTabsEnum).map(value => ({
            value: value,
            label: t(`${isDispatcherContext ? '' : 'shipper-'}${value}`),
            counter: offersStats[value],
        }));
    }, [offersStats, isDispatcherContext]);

    return { tabs };
};
