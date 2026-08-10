import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { BalanceType } from '@/enums/balance-type';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AccountingStatisticCounters } from '@/components/admin/accounting/common/accounting-statistic-counter/accounting-statistic-counters';
import { BalancePageHead } from '@/components/admin/accounting/common/balance-page-head/balance-page-head';
import { CancelRollbackTransactionPopup } from '@/components/admin/accounting/common/cancel-rollback-transaction-popup/cancel-rollback-transaction-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { CustomBalanceTable } from '@/components/admin/accounting/custom-balance/custom-balance-table/custom-balance-table';
import { DeclineOrPayToDriverPopup } from '@/components/admin/accounting/cod-orders/declined-or-pay-to-driver-popup/declined-or-pay-to-driver-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { TransactionsFilters } from '@/components/admin/accounting/common/transactions-filters/transactions-filters';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, fetchedBalanceSelector } from '@store/admin';
import { useGetBalanceQuery } from '@store/api/balances-api';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('admin:accounting:custom-balance');

const CustomBalancePage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const balanceId = router.query['balance-id'] as string;

    const { data: balance, isSuccess, isError } = useGetBalanceQuery(balanceId ?? '', { skip: !balanceId });

    useEffect(() => {
        if (!balance) return;

        dispatch(accountingActions.setFetchedBalance(balance));

        if (isError) {
            toast.error<string>(t('upload-wallet-error'));
        }
    }, [dispatch, isError, balance]);

    if (!isSuccess) {
        return null;
    }

    return (
        <AccountingPageLayout>
            <AccountingStatisticCounters balance={balance} />
            <TransactionsFilters context='custom-balance' />
            <CustomBalanceTable />

            <CreateTransactionPopup context={BalanceType.CUSTOM_INTERNAL_WALLET} />
            <CancelRollbackTransactionPopup />
            <DeclineOrPayToDriverPopup />
        </AccountingPageLayout>
    );
};

const PageHead = () => {
    const balance = useAppSelector(fetchedBalanceSelector);

    return (
        <BalancePageHead
            title={t('title', { projectName: getProjectName() })}
            header={balance?.name ?? t('header')}
            isAddTransactionBtn={true}
            balanceId={balance?.publicId}
        />
    );
};

CustomBalancePage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.custom_wallets' }],
});

export default CustomBalancePage;
