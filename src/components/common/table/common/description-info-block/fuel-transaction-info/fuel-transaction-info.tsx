import React, { useMemo } from 'react';

import { isNumber } from '@/shared/type-guards';
import { FuelTransactionLocation, FuelTransactionRawData, Transaction } from '@store/admin';
import { getGallonsTranslate } from '@utils/translate/get-units-of-measurement-translate';

export type FuelTransactionInfoProps = Pick<Transaction, 'metadata'>;

const formatGallonsInfo = (data: FuelTransactionRawData) => {
    const items = Array.isArray(data.lineItems) ? data.lineItems : [data.lineItems];

    return items
        .map(({ groupCategory, quantity }) => {
            if (!isNumber(quantity)) {
                return null;
            }

            const formattedQuantity = getGallonsTranslate(quantity.toFixed(2));

            return groupCategory ? `${formattedQuantity} ${groupCategory}` : formattedQuantity;
        })
        .filter(Boolean)
        .join(', ');
};

const formatLocation = (location?: FuelTransactionLocation): string | null => {
    if (!location) return null;

    const { city, state, zip } = location;

    return [city, state, zip].filter(Boolean).join(', ');
};

export const FuelTransactionInfo = ({ metadata }: FuelTransactionInfoProps) => {
    const { location, fuelCardTransaction } = metadata || {};

    const locationText = useMemo(() => formatLocation(location), [location]);
    const gallonsCountText = useMemo(() => fuelCardTransaction && formatGallonsInfo(fuelCardTransaction), [fuelCardTransaction]);

    return (
        <span>
            {gallonsCountText}
            {locationText && <>, {locationText}</>}
        </span>
    );
};
