import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import { OrderType } from '@enums';
import {SelectField} from '@/fields/select-field';
import { translateOrderStatisticsStatus } from '@utils/translate/order/translations';

import { ORDER_STATISTICS_STATUS_MAP } from './constants';

type OrderStatusSelectProps = FieldRenderProps<string> & { orderType?: OrderType };

export const AdminOrderStatisticsStatusSelect = ({ orderType = OrderType.SHIPPER, ...props }: OrderStatusSelectProps) => {
    const options = useMemo(
        () =>
            ORDER_STATISTICS_STATUS_MAP[orderType].map(statisticsStatus => ({
                label: translateOrderStatisticsStatus(statisticsStatus),
                value: statisticsStatus,
            })),
        [orderType],
    );

    return (
        <SelectField
            options={options}
            {...props}
            isMulti={true}
            input={{
                ...props.input,
                onChange: (val: SelectOption<string>[]) => {
                    props.input.onChange(val.map(({ value }) => value));
                },
                value: options?.filter(({ value }) => props.input.value.includes(value)),
            }}
            meta={{
                ...props.meta,
                initial: options?.filter(({ value }) => {
                    if (!props.meta.initial) {
                        return false;
                    }

                    return props.meta.initial.includes(value);
                }),
            }}
        />
    );
};
