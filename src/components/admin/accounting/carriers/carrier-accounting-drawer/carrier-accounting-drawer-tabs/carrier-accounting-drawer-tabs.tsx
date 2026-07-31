import React from 'react';

import { Tabs } from '@/components/common/tabs/tabs';
import { classname } from '@utils/classname';

import { useCarrierAccountingDrawerTabs } from './useCarrierAccountingDrawerTabs';

import './carrier-accounting-drawer-tabs.scss';

const cn = classname('carrier-accounting-drawer-tabs');

export const CarrierAccountingDrawerTabs = () => {
    const { tabs, onSelectTabHandler, selectedTab } = useCarrierAccountingDrawerTabs();

    return <Tabs classNames={cn()} tabs={tabs} onSelectTab={onSelectTabHandler} initialSelectedTabIndex={tabs.findIndex(el => el.value === selectedTab)} />;
};
