import { TabItemBase } from '@/components/common';

export type AccountingDrawerTabsProps = {
    onSelectTab: (tab: TabItemBase) => void;
    queryTab?: string | string[];
};
