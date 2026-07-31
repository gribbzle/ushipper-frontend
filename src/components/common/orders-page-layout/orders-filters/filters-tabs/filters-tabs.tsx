import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toCamelCase } from 'js-convert-case';

import { Dropdown } from '@/components/common/dropdown/dropdown';
import DropdownArrow from '@/components/common/main-layout/header-user-block/dropdown-arrow.svg';
import { Tabs } from '@/components/common/tabs/tabs';
import { OrderStatisticsStatus } from '@/enums';
import { isString } from '@/shared';
import { StatisticsCounters } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateOrderStatisticsStatus } from '@utils/translate/order/translations';

import { useTabsNames } from './useTabsNames';
import { getCounterValue } from './utils';

type FiltersTabsProps = {
    onTabClick: (tab: OrdersFilterTab) => void;
    initialFilterTabValue?: OrderStatisticsStatus;
    statisticsCounters?: StatisticsCounters;
};

export type OrdersFilterTab = {
    label: string;
    counter?: number;
    subText?: string;
    value: OrderStatisticsStatus;
    component?: React.ReactNode;
};

const cn = classname('dropdown');
const t = translateByNamespace('client:order-actions');

export const FiltersTabs = ({ onTabClick, initialFilterTabValue, statisticsCounters }: FiltersTabsProps) => {
    const [activeTab, setActiveTab] = useState(initialFilterTabValue);
    const [tabsBeforeDropdown, setTabsBeforeDropdown] = useState(11);

    useEffect(() => {
        setActiveTab(initialFilterTabValue);
    }, [initialFilterTabValue]);

    const tabsNames = useTabsNames();

    const checkActiveTab = useCallback(
        (tabName: string) => {
            if (activeTab) {
                const tabsToDropdown = tabsNames.slice(tabsBeforeDropdown) as string[];

                return activeTab === tabName || ('dropdown' === tabName && tabsToDropdown.includes(activeTab));
            }

            return false;
        },
        [activeTab, tabsNames, tabsBeforeDropdown],
    );
    const onTabClickCallback = useCallback(
        (tab: OrdersFilterTab) => {
            setActiveTab(tab.value);
            if (onTabClick) {
                onTabClick(tab);
            }
        },
        [onTabClick, setActiveTab],
    );

    const setTabCount = useCallback((newCount: number) => {
        setTabsBeforeDropdown(newCount > 11 ? 11 : newCount);
    }, []);

    const changeItemsCount = useCallback(
        (val: boolean) => {
            let newCount;

            if (val) {
                newCount = tabsBeforeDropdown - 1;
            } else {
                newCount = tabsBeforeDropdown + 1;
            }

            setTabCount(newCount);
        },
        [tabsBeforeDropdown, setTabCount],
    );

    const tabs = useMemo((): OrdersFilterTab[] => {
        const defaultNames = tabsNames.slice(0, tabsBeforeDropdown);
        const tabsToDropdown = tabsNames.slice(tabsBeforeDropdown);

        const defaultTabs = defaultNames.map(tabName => {
            const counter = getCounterValue(statisticsCounters?.statusCounters?.[toCamelCase(tabName)]);

            return {
                label: translateOrderStatisticsStatus(tabName),
                value: tabName,
                ...(isString(counter) ? { subText: counter } : { counter }),
            };
        });

        if (tabsToDropdown.length) {
            return [
                ...defaultTabs,
                {
                    label: '',

                    // TODO: Пересмотреть типизацию 'dropdown' в OrdersFilterTab, чтобы не приводить к OrderStatisticsStatus
                    value: 'dropdown' as OrderStatisticsStatus,
                    component: (
                        <Dropdown
                            offset={0}
                            trigger='hover'
                            menuComponent={
                                <div>
                                    {tabsToDropdown.map(tabName => (
                                        <div
                                            key={tabName}
                                            className={cn('option', {
                                                active: tabName === activeTab,
                                            })}
                                            onClick={() =>
                                                onTabClickCallback({
                                                    value: tabName,
                                                    label: '',
                                                })
                                            }
                                        >
                                            {translateOrderStatisticsStatus(tabName)}
                                            <sup>{getCounterValue(statisticsCounters?.statusCounters?.[toCamelCase(tabName)])}</sup>
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            {t('more-button-title')} <DropdownArrow />
                        </Dropdown>
                    ),
                },
            ];
        }

        return defaultTabs;
    }, [statisticsCounters, tabsNames, activeTab, onTabClickCallback, tabsBeforeDropdown]);

    const initialSelectedTabIndex = useMemo((): number | undefined => {
        const index = tabs.findIndex(item => item.value === initialFilterTabValue);

        return index === -1 ? undefined : index;
    }, [initialFilterTabValue, tabs]);

    return (
        <Tabs<OrdersFilterTab>
            itemsWithFillinWith={changeItemsCount}
            checkActiveTab={checkActiveTab}
            onSelectTab={onTabClickCallback}
            tabs={tabs}
            initialSelectedTabIndex={initialSelectedTabIndex}
            setTabCount={setTabCount}
        />
    );
};
