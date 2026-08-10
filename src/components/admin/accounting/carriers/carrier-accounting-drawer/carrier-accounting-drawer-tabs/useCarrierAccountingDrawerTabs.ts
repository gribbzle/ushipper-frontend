import { useCallback, useMemo } from 'react';

import { TabItemBase } from '@/components/common/tabs/tabs';
import { CarrierAccountingDrawerTab } from '@/enums/tabs/carrier-accounting-drawer-tab';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, carrierAccountingDrawerPropsSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:tabs');

export const useCarrierAccountingDrawerTabs = () => {
    const { selectedTab } = useAppSelector(carrierAccountingDrawerPropsSelector);

    const dispatch = useAppDispatch();

    const onSelectTabHandler = useCallback(
        ({ value }: TabItemBase) => {
            dispatch(accountingActions.setCarrierAccountingDrawerProps({ selectedTab: value as CarrierAccountingDrawerTab }));
        },
        [dispatch],
    );

    const tabs = useMemo<TabItemBase[]>(
        () =>
            Object.values(CarrierAccountingDrawerTab).map(tab => ({
                label: t(tab),
                value: tab,
            })),
        [],
    );

    return { tabs, onSelectTabHandler, selectedTab };
};
