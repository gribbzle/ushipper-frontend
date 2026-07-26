import React, { useCallback } from 'react';
import Head from 'next/head';

import { Button, PageHeader } from '@components';
import { PlusCircleIcon } from '@icons';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:wallets-page');

export const WalletsPageHead = () => {
    const dispatch = useAppDispatch();
    const openCreateWalletPopup = useCallback(
        () => dispatch(accountingActions.setCreateWalletPopupProps({ isPopupOpened: true, walletName: null, walletId: null })),
        [dispatch],
    );

    return (
        <>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>
                {t('header')}
                <Button view='primary' size='medium' onClick={() => openCreateWalletPopup()}>
                    <PlusCircleIcon /> {t('add-custom-wallet-button')}
                </Button>
            </PageHeader>
        </>
    );
};
