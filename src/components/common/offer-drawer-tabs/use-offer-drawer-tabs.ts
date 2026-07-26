import { useMemo } from 'react';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';
import { TabItemBase } from '@/components/common';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:order-offers');

export const useOfferDrawerTabs = () => {
    const tabs = useMemo<TabItemBase[]>(
        () => [
            { label: t('drawer:details'), value: OfferTabsEnum.details },
            { label: t('drawer:message-tab'), value: OfferTabsEnum.message },
        ],
        [],
    );

    return { tabs };
};
