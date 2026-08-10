import React, { useCallback, useState } from 'react';
import Head from 'next/head';

import { useBalanceTable } from '@/components/admin/accounting/common/balance-table/use-balance-table';
import { useCreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/use-create-transaction-popup';
import { BackLink } from '@/components/common/back-link/back-link';
import { Button } from '@/components/common/button/button';
import { ExportButton } from '@/components/common/button/ExportButton';
import { PageHeader } from '@/components/common/page-header/page-header';
import { BalanceType } from '@/enums/balance-type';
import { TransactionTypeGroup } from '@/enums/transactions/transaction-type-group';
import { useExportTransactions } from '@/hooks/useDownload';
import { useIsTransactionsPage } from '@/hooks/accounting/use-is-transactions-page';
import { useTransactionActionsPermission } from '@/hooks/accounting/use-transaction-actions-permission';
import { translateByNamespace } from '@utils/i18n';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

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
