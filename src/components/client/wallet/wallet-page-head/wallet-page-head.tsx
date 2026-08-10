import React, { useCallback } from 'react';
import Head from 'next/head';

import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { useAppDispatch } from '@store';
import { walletActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import CreditCardIcon from '@/assets/icons/credit-card-icon.svg';

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
