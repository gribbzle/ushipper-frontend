import { useMemo, useState } from 'react';

import { TabItemBase } from '@components';
import { LoadboardTab } from '@enums';
import { useIsPartnerCompany, useLoadboard, useLoadboardTabSelection, useMeDriverRelated } from '@hooks';
import { useAppSelector } from '@store';
import { loadboardSavedSearchesSelector } from '@store/client/loadboard';
import { translateLoadboardTab } from '@utils';

import { DRIVER_RESTRICTED_TABS, NON_PARTNER_RESTRICTED_TABS } from './constants';
import { formatLoadboardTabCounter } from './utils';

export const useLoadboardTabs = () => {
    const { statistic } = useLoadboard();
    const { activeTab } = useLoadboardTabSelection();
    const isPartner = useIsPartnerCompany();
    const isDriverRelated = useMeDriverRelated();
    const { searches } = useAppSelector(loadboardSavedSearchesSelector);
    const [initialTabIndex, setInitialTabIndex] = useState<number>();

    const tabs = useMemo((): TabItemBase[] => {
        const tabs: TabItemBase[] = [];

        Object.values(LoadboardTab)
            .filter(tab => {
                const isExcludedForDriver = isDriverRelated && DRIVER_RESTRICTED_TABS.includes(tab);
                const isExcludedForNonPartner = !isPartner && NON_PARTNER_RESTRICTED_TABS.includes(tab);
                const shouldInclude = !isExcludedForDriver && !isExcludedForNonPartner;

                return shouldInclude;
            })
            .forEach(tab => {
                switch (tab) {
                    case LoadboardTab.SAVED: {
                        if (searches.length) {
                            tabs.push({
                                value: tab,
                                label: translateLoadboardTab(tab),
                                counter: searches.length,
                            });
                        }
                        break;
                    }
                    default: {
                        tabs.push({
                            value: tab,
                            label: translateLoadboardTab(tab),
                            supText: formatLoadboardTabCounter(statistic?.statusCounters[tab]),
                        });
                        break;
                    }
                }
            });

        const index = tabs.findIndex(tab => tab.value === activeTab);

        setInitialTabIndex(index === -1 ? 0 : index);

        return tabs;
    }, [isDriverRelated, isPartner, searches.length, statistic?.statusCounters, activeTab]);

    return { tabs, initialTabIndex };
};
