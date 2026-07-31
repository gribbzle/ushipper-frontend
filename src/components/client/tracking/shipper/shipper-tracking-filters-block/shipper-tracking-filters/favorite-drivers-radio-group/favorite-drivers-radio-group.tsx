import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { RadioOption } from '@/components/common';
import { RadioGroupInput } from '@fields';
import { translateByNamespace } from '@utils/i18n';

import { ShipperTrackingFieldWrapper } from '../shipper-tracking-field-wrapper';

const t = translateByNamespace('client:tracking-page:shipper-filters');

export const FavoriteDriversRadioGroup = () => {
    const options: RadioOption[] = useMemo(
        () => [
            {
                label: t('all'),
                value: 'all',
            },
            {
                label: t('favorite-only'),
                value: 'only_favorite',
            },
        ],
        [],
    );

    return (
        <ShipperTrackingFieldWrapper title={t('driver-group-label')}>
            <Field parse={value => value} name='driverFlagged' component={RadioGroupInput} options={options} view='checkbox' />
        </ShipperTrackingFieldWrapper>
    );
};
