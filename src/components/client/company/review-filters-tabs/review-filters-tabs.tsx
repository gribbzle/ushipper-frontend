import React, { useMemo } from 'react';

import { TabItemBase } from '@/components/common/tabs/tabs';
import { Tabs } from '@/components/common/tabs/tabs';
import { ReviewTabsEnum } from '@/enums/review-tab-enum';
import { translateByNamespace } from '@utils/i18n';

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
