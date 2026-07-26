import React, { useMemo } from 'react';
import { format } from 'date-fns';
import has from 'has-values';

import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname, getObjectWithoutEmptyFields } from '@utils';

import './route-item.scss';

const cn = classname('route-item');

type Props = {
    data: OrderPickupInformation | OrderDeliveryInformation;
};

export const RouteItem = ({ data }: Props) => {
    const { city, state, zip } = data;

    const date = useMemo(() => ('scheduledPickupAt' in data ? data.scheduledPickupAt : data.scheduledDeliveryAt), [data]);

    const address = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                city,
                state,
                zip,
            }),
        [city, state, zip],
    );

    return (
        <div className={cn()}>
            {has(address) && <span className={cn('address')}>{Object.values(address).join(', ')}</span>}
            {date && (
                <>
                    <div className={cn('ellipse')} />
                    <span className={cn('date')}>{format(new Date(date), 'MMM d')}</span>
                </>
            )}
        </div>
    );
};
