import { useMemo } from 'react';

import { OffersListTabsEnum } from '@/enums';
import { TabItemBase } from '@components';
import { useMeShipper } from '@hooks';
import { OffersStatistic } from '@store/api/order-offers';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:order-offers:filters');

export const useOffersFiltersTabs = (offersStats: OffersStatistic & { all: number }) => {
    const isShipperContext = useMeShipper();

    const tabs = useMemo<TabItemBase[]>(() => {
        return Object.values(OffersListTabsEnum).map(value => ({
            value: value,
            label: t(`${isShipperContext ? 'shipper-' : ''}${value}`),
            counter: offersStats[value],
        }));
    }, [offersStats, isShipperContext]);

    return { tabs };
};
