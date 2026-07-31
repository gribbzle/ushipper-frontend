import React, { useCallback, useMemo } from 'react';

import { RowItem } from '@/components/common';
import { AccountingAccountTransactionsData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';
import { convertCentsToInteger } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import './transactions-info-block.scss';

const cn = classname('transactions-info-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:table');

type TransactionsInfoBlockProps = {
    transactions: AccountingAccountTransactionsData;
    accountId: string;
};

export const TransactionsInfoBlock = ({ accountId, transactions: { total, cashOutSum } }: TransactionsInfoBlockProps) => {
    const handleTotalCountTransactionsClick = useCallback(async () => {
        if (!total) {
            return null;
        }

        window.open(`transactions?accountId=${accountId}`, '_blank');
    }, [total, accountId]);

    const isDangerCashOutText = useMemo(() => convertCentsToInteger(cashOutSum.amount) > 0, [cashOutSum.amount]);

    return (
        <div className={cn()}>
            <RowItem label={t('total')} value={total} isHover={total > 0} onClick={handleTotalCountTransactionsClick} />
            <RowItem label={t('cash-out-sum')} value={cashOutSum.formatted} valueClassName={cn('', { danger: isDangerCashOutText })} />
        </div>
    );
};
