import React, { useMemo } from 'react';

import { Button } from '@/components/common';
import { useDriversActionsPermission } from '@hooks';
import { useAppSelector } from '@store';
import { accountingDrawerPropsSelector, isCreateAccountingProfileLoadingSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { AccountingTab } from '../accounting-drawer-tabs';
import { useAccountingDrawer } from '../use-accounting-drawer';

const t = translateByNamespace('common:create-edit-user-drawer');

export const useAccountingDrawerActions = () => {
    const hasDriversActionsPermission = useDriversActionsPermission();
    const { formId, selectedTab } = useAccountingDrawer();
    const isLoading = useAppSelector(isCreateAccountingProfileLoadingSelector);
    const { isFinancialFormVisible, isRocketkorFormVisible } = useAppSelector(accountingDrawerPropsSelector);

    const isActions = useMemo(
        () =>
            hasDriversActionsPermission &&
            ((selectedTab !== AccountingTab.ACCOUNT_BALANCE && (isFinancialFormVisible || isRocketkorFormVisible)) || selectedTab === AccountingTab.AGREEMENTS),
        [hasDriversActionsPermission, selectedTab, isFinancialFormVisible, isRocketkorFormVisible],
    );

    const actions = useMemo(
        () =>
            isActions ? (
                <Button view='primary' type='submit' form={formId} hasLoader={isLoading}>
                    {t('save-user-button')}
                </Button>
            ) : null,
        [isActions, formId, isLoading],
    );

    return { actions };
};
