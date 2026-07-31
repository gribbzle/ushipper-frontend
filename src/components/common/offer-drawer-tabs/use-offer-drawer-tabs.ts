import { useMemo } from 'react';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-tabs-enum';
import { TabItemBase } from '@/components/common/tabs/tabs';
import { translateByNamespace } from '@utils/i18n';

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
