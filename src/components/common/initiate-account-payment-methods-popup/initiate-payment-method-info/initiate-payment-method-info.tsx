import React from 'react';
import has from 'has-values';

import { MassPayCompanyDTO, MassPayPayerDTO } from '@store/api/accounts-api';
import { DotLeader } from '@ui';
import { classname, formatDate, translateByNamespace } from '@utils';

import './initiate-payment-method-info.scss';

type InitiatePaymentMethodInfoProps = {
    payer: MassPayPayerDTO;
    company: MassPayCompanyDTO;
};

const t = translateByNamespace('admin:accounting:initiate-account-payment-methods-popup:info');
const cn = classname('initiate-payment-method-info');

const renderSection = (title: string, items: { label: string; value: string | number | null }[]) => (
    <div className={cn('section')}>
        <h4>{title}</h4>
        {items.map(({ label, value }, index) => (
            <DotLeader key={index} label={label} value={value ?? t('no-details')} />
        ))}
    </div>
);

export const InitiatePaymentMethodInfo = ({ payer, company }: InitiatePaymentMethodInfoProps) => {
    const { additionalDescription, estimatedAvailability, name: payerName, sourceAmount, fee } = payer;
    const { name: companyName, description, rating } = company;

    const paymentSystemItems = [
        { label: t('name'), value: payerName ?? t('no-details') },
        { label: t('description'), value: has(additionalDescription) ? additionalDescription : t('no-details') },
        { label: t('estimated-availability'), value: formatDate(estimatedAvailability) ?? t('no-details') },
    ];

    const paymentCompanyItems = [
        { label: t('name'), value: companyName || t('no-details') },
        { label: t('description'), value: description },
        ...(has(rating) ? [{ label: t('rating'), value: `${rating}/5` }] : []),
    ];

    const financialInfoItems = [
        { label: t('amount'), value: sourceAmount.formatted },
        { label: t('fee'), value: fee.formatted },
    ];

    return (
        <div className={cn()}>
            {renderSection(t('payment-system'), paymentSystemItems)}
            {renderSection(t('payment-company'), paymentCompanyItems)}
            {renderSection(t('financial-info'), financialInfoItems)}
        </div>
    );
};
