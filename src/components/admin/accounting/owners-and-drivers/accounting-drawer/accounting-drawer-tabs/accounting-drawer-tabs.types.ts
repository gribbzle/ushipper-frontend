import { TabItemBase } from '@/components/common/tabs/tabs';

export type AccountingDrawerTabsProps = {
    onSelectTab: (tab: TabItemBase) => void;
    queryTab?: string | string[];
};
