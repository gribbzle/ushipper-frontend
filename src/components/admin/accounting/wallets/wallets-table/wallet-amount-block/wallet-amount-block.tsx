import React from 'react';

import { AmountInfoBlock } from '@/components/common/table/common/amount-info-block/amount-info-block';
import { BalanceValue } from '@store/admin';

export const WalletAmountBlock = ({ balance, view = 'light' }: { balance: BalanceValue; view?: 'light' | 'bold' }) => {
    const { amount, formatted } = balance;
    const formattedAmount = Number(amount);
    const disabled = formattedAmount >= 0;

    return formatted ? <AmountInfoBlock value={formattedAmount} disabled={disabled} view={view} /> : <>—</>;
};
