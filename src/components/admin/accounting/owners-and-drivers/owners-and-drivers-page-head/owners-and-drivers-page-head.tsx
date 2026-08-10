import React from 'react';
import Head from 'next/head';

import { useCreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/use-create-transaction-popup';
import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { useTransactionActionsPermission } from '@/hooks/accounting/use-transaction-actions-permission';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

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
