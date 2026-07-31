import React from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountTransactionsBlock } from '../account-transactions-block';
import { TransactionItem } from '../transaction-item';

import { useAwaitingTransactions } from './use-awaiting-transactions';

import './awaiting-transactions.scss';

const cn = classname('awaiting-transactions');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');

export const AwaitingTransactions = () => {
    const { transactionsData, areMoreTransactions, subTitle } = useAwaitingTransactions();

    if (!transactionsData?.data?.length) {
        return null;
    }

    return (
        <AccountTransactionsBlock title={t('awaiting-transactions-title')} subTitle={subTitle} showViewAllButton={areMoreTransactions}>
            <div className={cn()}>
                {transactionsData?.data.map(transaction => (
                    <TransactionItem key={transaction.publicId} info={transaction} showTransactionType={true} />
                ))}
            </div>
        </AccountTransactionsBlock>
    );
};
