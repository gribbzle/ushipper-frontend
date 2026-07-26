import React, { useCallback, useEffect, useRef, useState } from 'react';

import { isNumber } from '@/shared';
import { classname, isClientSide } from '@utils';

import './tabs.scss';

export type TabItemBase = {
    label: string;
    value: string;
    counter?: number;
    supText?: string;
    component?: React.ReactNode;
};

type TabsProps<TabItem> = {
    tabs: TabItem[];
    initialSelectedTabIndex?: number;
    onSelectTab: (tab: TabItem) => void;
    classNames?: string;
    checkActiveTab?: (tabName: string) => boolean;
    itemsWithFillinWith?: (val: boolean) => void;
    setTabCount?: (count: number) => void;
};

const cn = classname('tabs');

export const Tabs = <TabItem extends TabItemBase>({
    tabs,
    onSelectTab,
    initialSelectedTabIndex,
    classNames,
    checkActiveTab,
    itemsWithFillinWith,
    setTabCount,
}: TabsProps<TabItem>) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(initialSelectedTabIndex || 0);
    const tabsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isNumber(initialSelectedTabIndex)) {
            setSelectedTabIndex(initialSelectedTabIndex);
        }
    }, [initialSelectedTabIndex]);

    const handleTabClick = useCallback(
        (index: number, tab: TabItem) => {
            setSelectedTabIndex(index);
            onSelectTab(tab);
        },
        [onSelectTab],
    );
    const getActiveTab = useCallback(
        (index: number) => {
            if (checkActiveTab) {
                const tabName = tabs[index].value;

                return checkActiveTab(tabName);
            }

            return index === selectedTabIndex;
        },
        [checkActiveTab, selectedTabIndex, tabs],
    );

    const prevTabsW = useRef(0);

    const onResize = useCallback(() => {
        const tabsElement = tabsRef.current;
        const parentElement = tabsElement?.parentElement;

        if (parentElement && tabsElement) {
            const parentW = parentElement.getClientRects()[0].width;
            const tabsW = tabsElement.getClientRects()[0].width;
            const tabsOverflowed = tabsW > parentW - 48;

            if (itemsWithFillinWith) {
                if (tabsOverflowed && prevTabsW.current > parentW) {
                    itemsWithFillinWith(true);
                    prevTabsW.current = parentW;
                }
                if (prevTabsW.current <= parentW - 100) {
                    itemsWithFillinWith(false);
                    prevTabsW.current = parentW;
                }
            }
        }
    }, [itemsWithFillinWith]);

    useEffect(() => {
        if (isClientSide()) {
            const tabsElement = tabsRef.current;
            const parentElement = tabsElement?.parentElement;

            if (tabsElement && parentElement && setTabCount) {
                const tabWith = tabsElement.getClientRects()[0].width;
                const parentWith = parentElement.getClientRects()[0].width;

                if (tabWith > parentWith) {
                    setTabCount(Math.round((parentWith - 48) / 130));
                }
            }
        }
    }, [tabs, setTabCount]);

    useEffect(() => {
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);

    return (
        <div className={cn('wrapper')}>
            <div className={`${cn()} ${classNames || ''}`} ref={tabsRef}>
                {tabs.map((tab, index) => {
                    return (
                        <div
                            key={tab.value}
                            className={cn('tab', { active: getActiveTab(index) })}
                            onClick={tab.component ? undefined : () => handleTabClick(index, tab)}
                        >
                            {tab.component || (
                                <p className={cn('label')}>
                                    {tab.label}
                                    {isNumber(tab.counter) && <sup>{tab.counter}</sup>}
                                    {tab.supText && <sup>{tab.supText}</sup>}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
