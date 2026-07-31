import React, { useMemo } from 'react';

import { RowItem } from '@/components/common';
import { FuelTransactionLineItem } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';
import { getGallonsTranslate } from '@utils/translate/get-units-of-measurement-translate';

import { FuelTransactionInfoWrapper } from '../fuel-transaction-info-wrapper';

export type FuelTransactionQuantityInfoProps = {
    info?: FuelTransactionLineItem[] | FuelTransactionLineItem;
};

const t = translateByNamespace('common:translate-value');

const renderLineItems = (items: FuelTransactionLineItem[]) =>
    items.map((item, index) => {
        const { groupCategory, quantity } = item;
        const formattedGroupCategory = groupCategory ?? t('empty-value');
        const formattedQuantity = quantity ? getGallonsTranslate(quantity.toFixed(2)) : t('empty-value');

        return <RowItem key={`${formattedGroupCategory}-${formattedQuantity}-${index}`} label={formattedGroupCategory} value={formattedQuantity} />;
    });

export const FuelTransactionQuantityInfo = ({ info }: FuelTransactionQuantityInfoProps) => {
    const totalQuantities = useMemo<number>(() => {
        if (!info) return 0;

        const items = Array.isArray(info) ? info : [info];
        const total = items.reduce((total, item) => total + (item.quantity ?? 0), 0);

        return total.toFixed(2);
    }, [info]);

    return (
        <FuelTransactionInfoWrapper
            total={getGallonsTranslate(totalQuantities)}
            infoContent={info ? renderLineItems(Array.isArray(info) ? info : [info]) : undefined}
        />
    );
};
