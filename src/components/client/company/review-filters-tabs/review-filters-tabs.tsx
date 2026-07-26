import React, { useMemo } from 'react';

import { ReviewTabsEnum } from '@/enums';
import { TabItemBase, Tabs } from '@components';
import { translateByNamespace } from '@utils';

type FiltersReviewTabsProps = {
    onTabClick: (tab: TabItemBase) => void;
    initialFilterTabValue?: string;
    reviewCounter?: number;
};

const t = translateByNamespace('client:company-page:tabs');

export const ReviewFiltersTabs = ({ onTabClick, initialFilterTabValue, reviewCounter }: FiltersReviewTabsProps) => {
    const tabs = useMemo<TabItemBase[]>(
        () =>
            Object.values(ReviewTabsEnum).map(tabName => ({
                label: t(tabName),
                value: tabName,
                counter: tabName === ReviewTabsEnum.RATINGS ? reviewCounter : undefined,
            })),
        [reviewCounter],
    );

    const initialSelectedTabIndex = useMemo<number | undefined>(() => {
        const index = tabs.findIndex(item => item.value === initialFilterTabValue);

        return index === -1 ? undefined : index;
    }, [initialFilterTabValue, tabs]);

    return <Tabs<TabItemBase> onSelectTab={onTabClick} tabs={tabs} initialSelectedTabIndex={initialSelectedTabIndex} />;
};
