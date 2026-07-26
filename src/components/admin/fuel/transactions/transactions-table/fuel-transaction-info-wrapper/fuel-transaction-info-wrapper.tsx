import React from 'react';

import { classname, translateByNamespace } from '@utils';

import './fuel-transaction-info-wrapper.scss';

type FuelTransactionInfoWrapperProps = {
    total: string;
    infoContent?: React.ReactNode;
};

const cn = classname('fuel-transaction-info-wrapper');
const t = translateByNamespace('common:translate-value');

export const FuelTransactionInfoWrapper = ({ total, infoContent }: FuelTransactionInfoWrapperProps) => {
    if (!infoContent) {
        return <span className={cn('')}>{t('empty-value')}</span>;
    }

    return (
        <div className={cn()}>
            <div className={cn('total')}>{total}</div>
            <div className={cn('', { info: true })}>{infoContent}</div>
        </div>
    );
};
