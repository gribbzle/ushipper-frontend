import React, { useMemo } from 'react';

import { InspectionTypeRadioGroup } from '@/components/common/inspection-type-radio-group/inspection-type-radio-group';
import { TransportTypeSelect } from '@/components/common/transport-type-select/transport-type-select';
import { FieldPrefix, FormControl, InputLabel, PrefixedField, TextField } from '@fields';
import { useDisableCarrierChanging, useMeCarrier, useMeShipper } from '@hooks';
import { useAppSelector } from '@store';
import { OrderFieldsGroup, orderPickedUpAtSelector, orderShipperOrderSelector } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { isUshipper } from '@utils/project-config';
import { required } from '@validators';

const t = translateByNamespace('client:order:details:fields');
const tPlaceholder = translateByNamespace('client:order:fields');

type Props = React.FormHTMLAttributes<HTMLFormElement | HTMLDivElement> & {
    isFulled?: boolean;
};

export const OrderDetailsFieldsGroup = ({ isFulled = true }: Props) => {
    const isMeShipper = useMeShipper();
    const isMeCarrier = useMeCarrier();
    const isDisabled = useDisableCarrierChanging();
    const pickedUpAt = useAppSelector(orderPickedUpAtSelector);
    const shipperOrder = useAppSelector(orderShipperOrderSelector);
    const disableInspectionType = useMemo(() => !!(pickedUpAt || shipperOrder), [pickedUpAt, shipperOrder]);

    return (
        <FieldPrefix prefix={OrderFieldsGroup.DETAILS}>
            <FormControl>
                <InputLabel required={true}>{t('order-id-label')}</InputLabel>
                <PrefixedField
                    name='orderId'
                    disabled={isDisabled}
                    component={TextField}
                    validate={required}
                    parse={value => value}
                    placeholder={tPlaceholder('no-placeholder')}
                />
            </FormControl>
            {isMeCarrier && (
                <FormControl>
                    <InputLabel>{t('internal-order-id-label')}</InputLabel>
                    <PrefixedField name='internalOrderId' component={TextField} parse={value => value} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
            )}
            {isMeShipper && (
                <FormControl>
                    <InputLabel>{t('transport-type')}</InputLabel>
                    <PrefixedField name='trailerType' component={TransportTypeSelect} parse={value => value} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
            )}
            {isUshipper && (
                <PrefixedField
                    component={InspectionTypeRadioGroup}
                    label={t('inspection-type-label')}
                    name='inspectionType'
                    parse={value => value}
                    disabled={disableInspectionType || isDisabled}
                    placeholder={tPlaceholder('no-placeholder')}
                />
            )}
            {isFulled && isMeShipper && (
                <FormControl className='order-instructions'>
                    <InputLabel>{t('order-instructions')}</InputLabel>
                    <PrefixedField
                        component={TextField}
                        name='instructions'
                        multiline={true}
                        parse={value => value}
                        placeholder={tPlaceholder('no-placeholder')}
                    />
                </FormControl>
            )}
            {isFulled && isMeCarrier && (
                <FormControl className='driver-instructions'>
                    <InputLabel>{t('driver-instructions-label')}</InputLabel>
                    <PrefixedField
                        component={TextField}
                        name='driverInstructions'
                        multiline={true}
                        parse={value => value}
                        placeholder={tPlaceholder('no-placeholder')}
                    />
                </FormControl>
            )}
        </FieldPrefix>
    );
};
