import React from 'react';
import Head from 'next/head';

import { Button, PageHeader, useCreateTransactionPopup } from '@components';
import { useTransactionActionsPermission } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:owners-and-drivers');
const tButton = translateByNamespace('admin:accounting');

export const OwnersAndDriversPageHead = () => {
    const { openCreateTransactionPopup } = useCreateTransactionPopup();
    const hasActionsPermission = useTransactionActionsPermission();

    return (
        <>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>
                {t('header')}
                {hasActionsPermission && (
                    <Button view='primary' size='medium' onClick={() => openCreateTransactionPopup({ disabledSourceWallet: false })}>
                        <PlusCircleIcon /> {tButton('add-transaction-button')}
                    </Button>
                )}
            </PageHeader>
        </>
    );
};
