import React from 'react';

import { Tabs } from '@/components/common/tabs/tabs';
import { classname } from '@utils/classname';

import { OfferDrawerTabsProps } from './offer-drawer-tabs.types';
import { useOfferDrawerTabs } from './use-offer-drawer-tabs';

import './offer-drawer-tabs.scss';

const cn = classname('offer-drawer-tabs');

export const OfferDrawerTabs = ({ onSelectTab, queryTab }: OfferDrawerTabsProps) => {
    const { tabs } = useOfferDrawerTabs();

    return <Tabs classNames={cn()} tabs={tabs} onSelectTab={onSelectTab} initialSelectedTabIndex={tabs.findIndex(el => el.value === queryTab)} />;
};
