import React from 'react';

import { classname, translateByNamespace } from '@utils';

import { AccountTransactionsBlock } from '../account-transactions-block';
import { TransactionItem } from '../transaction-item';

import { useRecentTransactions } from './use-recent-transactions';

import './recent-transactions.scss';

const cn = classname('recent-transactions');
const tSubTitle = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:tabs');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');

export const RecentTransactions = () => {
    const { title, transactionsData, areMoreTransactions } = useRecentTransactions();

    return (
        <AccountTransactionsBlock subTitle={tSubTitle('account-balance')} title={title} showViewAllButton={areMoreTransactions} displayAddTransaction={true}>
            <div className={cn()}>
                <div className={cn('title')}>{t('recent-transaction')}</div>
                {transactionsData && transactionsData.data.length > 0 ? (
                    transactionsData.data.map(transaction => <TransactionItem key={transaction.publicId} info={transaction} />)
                ) : (
                    <span>{t('no-transactions-text')}</span>
                )}
            </div>
        </AccountTransactionsBlock>
    );
};
