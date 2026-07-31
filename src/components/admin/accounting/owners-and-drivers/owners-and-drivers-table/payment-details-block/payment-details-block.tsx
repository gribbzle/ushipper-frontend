import React from 'react';

import { AccountingAccountBalanceData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';

import { PaymentDetailsDropdownMenu } from './payment-details-dropdown-menu';

import './payment-details-block.scss';

const cn = classname('payment-details-block');

type PaymentDetailsBlockProps = {
    balances: AccountingAccountBalanceData[];
};

export const PaymentDetailsBlock = ({ balances }: PaymentDetailsBlockProps) => (
    <div className={cn()}>
        <PaymentDetailsDropdownMenu balances={balances} />
    </div>
);
