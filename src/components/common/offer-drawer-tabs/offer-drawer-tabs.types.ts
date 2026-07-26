import { TabItemBase } from '../tabs';

export type OfferDrawerTabsProps = {
    onSelectTab: (tab: TabItemBase) => void;
    queryTab?: string | string[];
};
