import React from 'react';

import { CashOutTransactionPopup, getMainLayout, WalletEmptyLayout, WalletFilters, WalletPageHead, WalletStatisticCounter, WalletTable } from '@components';
import { useAppSelector } from '@store';
import { authorizedUserDefaultBalanceSelector } from '@store/global';
import { classname } from '@utils';

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
