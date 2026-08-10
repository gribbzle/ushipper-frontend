import React, { useCallback } from 'react';
import Head from 'next/head';

import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

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
