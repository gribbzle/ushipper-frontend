import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { RadioOption } from '@/components/common/radio-button-group/radio-button-group';
import { TrackingOrderStatus } from '@/enums';
import { RadioGroupInput } from '@fields';
import { translateByNamespace } from '@utils/i18n';
import { getTrackingOrderStatusTranslate } from '@utils/translate/tracking/get-tracking-order-status-translate';

import { ShipperTrackingFieldWrapper } from '../shipper-tracking-field-wrapper';

const t = translateByNamespace('client:tracking-page:shipper-filters');

export const StatusOrdersRadioGroup = () => {
    const options: RadioOption[] = useMemo(() => {
        const statusOptions = Object.values(TrackingOrderStatus).map(status => ({
            value: status,
            label: getTrackingOrderStatusTranslate(status),
        }));

        return [
            ...statusOptions,
            {
                value: 'all',
                label: t('all'),
            },
        ];
    }, []);

    return (
        <ShipperTrackingFieldWrapper title={t('orders-group-label')}>
            <Field parse={value => value} name='status' component={RadioGroupInput} options={options} view='checkbox' />
        </ShipperTrackingFieldWrapper>
    );
};
