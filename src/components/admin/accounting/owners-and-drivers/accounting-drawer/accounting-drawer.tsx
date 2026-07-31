import React, { useMemo } from 'react';

import { Drawer } from '@/components/common/drawer/drawer';
import { Loader } from '@/components/common/loader/loader';
import { classname } from '@utils/classname';

import { useAccountingDrawerActions } from './hooks/use-accounting-drawer-actions';
import { AccountBalance } from './account-balance';
import { AccountingDrawerHeader } from './accounting-drawer-header';
import { AccountingDrawerTabs, AccountingTab } from './accounting-drawer-tabs';
import { AgreementsDetails } from './agreements-details';
import { FinancialAccounts } from './financial-accounts';
import { Rocketkor } from './rocketkor';
import { useAccountingDrawer } from './use-accounting-drawer';

import './accounting-drawer.scss';

const cn = classname('accounting-drawer');

export const AccountingDrawer = () => {
    const { selectedTab, isDrawerOpened, isLoading, isError, errorText, handleCloseDrawer, onSelectTabHandler } = useAccountingDrawer();
    const { actions } = useAccountingDrawerActions();

    const body = useMemo(() => {
        if (isError) {
            return <div className={cn('body-empty')}>{errorText}</div>;
        }

        if (isLoading) {
            return <Loader />;
        }

        return (
            <>
                <AccountingDrawerTabs onSelectTab={onSelectTabHandler} queryTab={selectedTab ?? AccountingTab.ACCOUNT_BALANCE} />
                <div className={cn('content')}>
                    {selectedTab === AccountingTab.ACCOUNT_BALANCE && <AccountBalance />}
                    {selectedTab === AccountingTab.AGREEMENTS && <AgreementsDetails />}
                    {selectedTab === AccountingTab.ROCKETKOR && <Rocketkor />}
                    {selectedTab === AccountingTab.FINANCIAL_ACCOUNTS && <FinancialAccounts />}
                </div>
            </>
        );
    }, [isError, isLoading, errorText, selectedTab, onSelectTabHandler]);

    return (
        <Drawer
            isOpen={isDrawerOpened}
            onClose={handleCloseDrawer}
            head={<AccountingDrawerHeader />}
            className={cn()}
            bodyClassName={cn('body')}
            actionsClassName={cn('actions')}
            body={body}
            actions={actions}
        />
    );
};
