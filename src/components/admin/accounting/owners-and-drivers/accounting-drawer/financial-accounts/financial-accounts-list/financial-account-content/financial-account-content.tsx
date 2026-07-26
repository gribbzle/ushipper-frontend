import React from 'react';
import has from 'has-values';

import { AccountingInfoRow } from '@/components/admin/accounting';
import { FinancialBalanceData } from '@store/admin';
import { classname, translateByNamespace } from '@utils';

import { useFinancialAccountContent } from './use-financial-account-content';

import './financial-account-content.scss';

const cn = classname('financial-account-content');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:item');
const tBankAccount = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const FinancialAccountContent = ({ balance }: { balance: FinancialBalanceData }) => {
    const { contactInfo, address, bankAccountInfo, cardInfo } = useFinancialAccountContent(balance);

    return (
        <>
            {has(contactInfo) && (
                <>
                    <span className={cn('name')}>{contactInfo.fullName}</span>
                    <AccountingInfoRow title={t('phone-number')} value={contactInfo.phone ?? '—'} />
                    <AccountingInfoRow title={t('email')} value={contactInfo.email ?? '—'} />
                </>
            )}
            {has(address) && <AccountingInfoRow title={t('billing-address')} value={Object.values(address).join(', ')} />}
            {has(bankAccountInfo) && (
                <>
                    {bankAccountInfo.bankName && <AccountingInfoRow title={tBankAccount('bank-name')} value={bankAccountInfo.bankName} />}
                    {bankAccountInfo.routingNo && <AccountingInfoRow title={tBankAccount('routing-number')} value={bankAccountInfo.routingNo} />}
                    {bankAccountInfo.accountNumber && <AccountingInfoRow title={tBankAccount('account-number')} value={bankAccountInfo.accountNumber} />}
                    {bankAccountInfo.nameOnAccount && <AccountingInfoRow title={tBankAccount('name-on-account')} value={bankAccountInfo.nameOnAccount} />}
                </>
            )}
            {has(cardInfo) && (
                <>
                    {cardInfo.middleName && <AccountingInfoRow title={tBankAccount('middle-name-on-card')} value={cardInfo.middleName} />}
                    {cardInfo.number && <AccountingInfoRow title={tBankAccount('card-number')} value={cardInfo.number} />}
                    {cardInfo.expiry && <AccountingInfoRow title={tBankAccount('card-exp-date')} value={cardInfo.expiry} />}
                </>
            )}
        </>
    );
};
