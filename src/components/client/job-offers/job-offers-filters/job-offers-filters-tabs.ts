import { useMemo } from 'react';

import { OffersListTabsEnum } from '@/enums';
import { TabItemBase } from '@components';
import { useMeDispatcher } from '@hooks';
import { OffersStatistic } from '@store/api/order-offers';
import { translateByNamespace } from '@utils';

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
