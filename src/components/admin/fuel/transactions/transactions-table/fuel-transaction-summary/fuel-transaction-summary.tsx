import React from 'react';

import { RowItem } from '@/components/common/table/common/row-item/row-item';
import { FuelTransactionLineItem } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { FuelTransactionInfoWrapper } from '../fuel-transaction-info-wrapper';

type SummaryMode = 'total' | 'discount';

type FuelTransactionSummaryProps = {
    fundedTotal?: number;
    discountAmount?: number;
    info?: FuelTransactionLineItem[] | FuelTransactionLineItem;
    mode: SummaryMode;
};

const t = translateByNamespace('common:translate-value');

const renderLineItems = (items: FuelTransactionLineItem[], mode: SummaryMode) =>
    items.map((item, index) => {
        const { groupCategory, amount, discAmount } = item;
        const formattedGroupCategory = groupCategory ?? t('empty-value');
        const value = mode === 'total' ? formatToCurrency((amount ?? 0) + (discAmount ?? 0)) : formatToCurrency(discAmount ?? 0);

        return <RowItem key={`${formattedGroupCategory}-${value}-${index}`} label={formattedGroupCategory} value={value} />;
    });

export const FuelTransactionSummary = ({ mode, fundedTotal, discountAmount, info }: FuelTransactionSummaryProps) => {
    const totalAmount = formatToCurrency((fundedTotal ?? 0) + (discountAmount ?? 0));

    return <FuelTransactionInfoWrapper total={totalAmount} infoContent={info ? renderLineItems(Array.isArray(info) ? info : [info], mode) : undefined} />;
};
