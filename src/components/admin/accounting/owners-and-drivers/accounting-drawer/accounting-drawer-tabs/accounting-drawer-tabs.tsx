import React from 'react';

import { Tabs } from '@/components/common/tabs/tabs';
import { classname } from '@utils/classname';

import { AccountingDrawerTabsProps } from './accounting-drawer-tabs.types';
import { useAccountingDrawerTabs } from './use-accounting-drawer-tabs';

import './accounting-drawer-tabs.scss';

const cn = classname('accounting-drawer-tabs');

export const AccountingDrawerTabs = ({ onSelectTab, queryTab }: AccountingDrawerTabsProps) => {
    const { tabs } = useAccountingDrawerTabs();

    return <Tabs classNames={cn()} tabs={tabs} onSelectTab={onSelectTab} initialSelectedTabIndex={tabs.findIndex(el => el.value === queryTab)} />;
};
