import { useMemo } from 'react';

import { TabItemBase } from '@/components/common/tabs/tabs';
import { OffersListTabsEnum } from '@/enums/offers-list-tabs-enum';
import { useMeShipper } from '@hooks';
import { OffersStatistic } from '@store/api/order-offers';
import { translateByNamespace } from '@utils/i18n';

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
