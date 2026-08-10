import React from 'react';

import { CashOutTransactionPopup } from '@/components/client/wallet/cash-out-transaction-popup/cash-out-transaction-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { WalletEmptyLayout } from '@/components/client/wallet/wallet-empty-layout/wallet-empty-layout';
import { WalletFilters } from '@/components/client/wallet/wallet-filters/wallet-filters';
import { WalletPageHead } from '@/components/client/wallet/wallet-page-head/wallet-page-head';
import { WalletStatisticCounter } from '@/components/client/wallet/wallet-statistic-counter/wallet-statistic-counter';
import { WalletTable } from '@/components/client/wallet/wallet-table/wallet-table';
import { useAppSelector } from '@store';
import { authorizedUserDefaultBalanceSelector } from '@store/global';
import { classname } from '@utils/classname';

import './wallet.scss';

const cn = classname('wallet-page');

const WalletPage = () => {
    const balance = useAppSelector(authorizedUserDefaultBalanceSelector);

    return (
        <>
            <div className={cn()}>
                {balance ? (
                    <>
                        <WalletStatisticCounter />
                        <WalletFilters />
                        <WalletTable />
                    </>
                ) : (
                    <WalletEmptyLayout />
                )}
            </div>

            <CashOutTransactionPopup />
        </>
    );
};

WalletPage.getLayout = getMainLayout({ head: <WalletPageHead /> });

export default WalletPage;
