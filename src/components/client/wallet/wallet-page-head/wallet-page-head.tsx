import React, { useCallback } from 'react';
import Head from 'next/head';

import { Button, PageHeader } from '@/components/common';
import { CreditCardIcon } from '@icons';
import { useAppDispatch } from '@store';
import { walletActions } from '@store/client';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('client:wallet-page');

export const WalletPageHead = () => {
    const dispatch = useAppDispatch();

    const openCashOutTransactionPopup = useCallback(() => dispatch(walletActions.setCashOutTransactionPopupProps({ isPopupOpened: true })), [dispatch]);

    return (
        <>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>
                {t('header')}
                <Button view='primary' size='medium' onClick={openCashOutTransactionPopup}>
                    <CreditCardIcon /> {t('cash-out-button')}
                </Button>
            </PageHeader>
        </>
    );
};
