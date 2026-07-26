import React, { useCallback, useState } from 'react';
import Head from 'next/head';

import { BalanceType, TransactionTypeGroup } from '@/enums';
import { useExportTransactions } from '@/hooks/useDownload';
import { BackLink, Button, ExportButton, PageHeader, useBalanceTable, useCreateTransactionPopup } from '@components';
import { useIsTransactionsPage, useTransactionActionsPermission } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { translateByNamespace } from '@utils';

type Props = {
    title: string;
    header: string;
    isAddTransactionBtn?: boolean;
    balanceType?: BalanceType;
    balanceId?: string;
};

const t = translateByNamespace('admin:accounting');

export const BalancePageHead = ({ title, header, isAddTransactionBtn = false, balanceType, balanceId }: Props) => {
    const hasActionsPermission = useTransactionActionsPermission();
    const isTransactionsPage = useIsTransactionsPage();
    const { openCreateTransactionPopup } = useCreateTransactionPopup();

    const { isSuccess, filters } = useBalanceTable({ balanceType, balanceId });
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const exportTransactions = useExportTransactions();

    const exportTransactionsHandler = useCallback(async () => {
        setIsExporting(true);
        const { typeGroup, ...others } = filters;

        const transactionParams = {
            typeGroup,
            ...others,
        };

        const balanceParams = {
            balanceType,
            balanceId,
            typeGroup: balanceType === BalanceType.USHIPPER_WALLET || balanceId ? undefined : TransactionTypeGroup.ORDER_PAYMENT,
            ...others,
        };

        await exportTransactions(isTransactionsPage ? transactionParams : balanceParams);

        setIsExporting(false);
    }, [filters, balanceType, balanceId, exportTransactions, isTransactionsPage]);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <PageHeader>
                <BackLink />
                {header}
                {hasActionsPermission && (
                    <>
                        {isAddTransactionBtn && (
                            <Button view='primary' size='medium' onClick={() => openCreateTransactionPopup({ disabledSourceWallet: true })}>
                                <PlusCircleIcon /> {t('add-transaction-button')}
                            </Button>
                        )}
                        <ExportButton onClick={exportTransactionsHandler} disabled={isExporting || !isSuccess} isLoading={isExporting} />
                    </>
                )}
            </PageHeader>
        </>
    );
};
