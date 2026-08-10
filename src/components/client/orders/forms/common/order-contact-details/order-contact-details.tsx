import React, { useCallback, useContext } from 'react';
import { useForm } from 'react-final-form';

import { ContactFooterContext } from '@/components/client/orders/forms/common/contact-footer-context/contact-footer-context';
import { Divider } from '@/components/common/divider/divider';
import { getCopyToCustomerState } from '@/utils/order';
import {FieldPrefixContext, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useDisableCarrierChanging } from '@/hooks/order/use-disable-carrier-changing';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, emailValidator } from '@validators';

import './order-contact-details.scss';

type Props = {
    className?: string;
    dividerLabel?: string;
};

const t = translateByNamespace('client:order:contact-details-fields');
const tPlaceholder = translateByNamespace('client:order:fields');
const cn = classname('order-contact-details');

export const OrderContactDetails = ({ className, dividerLabel }: Props) => {
    const isDisabled = useDisableCarrierChanging();
    const { toggleCopyBtnState, toggleSwitchState } = useContext(ContactFooterContext);

    const { getState } = useForm();
    const { prefix } = useContext(FieldPrefixContext);
    const toggleCopyToCustomerState = useCallback(
        (val: string, key: string) => {
            const stateValues = getState().values;

            const addressFieldValue = getCopyToCustomerState(stateValues, prefix, val, key);

            toggleCopyBtnState(prefix as OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION, addressFieldValue);
            toggleSwitchState(
                prefix as OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION | OrderFieldsGroup.CUSTOMER_INFORMATION,
                addressFieldValue,
            );
        },
        [prefix, getState, toggleCopyBtnState, toggleSwitchState],
    );

    return (
        <div className={cn('', [className])}>
            {dividerLabel && <Divider>{dividerLabel}</Divider>}
            <FormControl className={cn('full-name-field')}>
                <InputLabel>{t('full-name-label')}</InputLabel>
                <PrefixedField
                    disabled={isDisabled}
                    component={TextField}
                    callback={(value: string) => {
                        toggleCopyToCustomerState(value, 'fullName');
                    }}
                    name='fullName'
                    parse={value => value}
                    placeholder={tPlaceholder('no-placeholder')}
                />
            </FormControl>
            <FormControl className={cn('phone-field')}>
                <InputLabel>{t('phone-label')}</InputLabel>
                <PrefixedField
                    disabled={isDisabled}
                    component={TextField}
                    callback={(value: string) => {
                        toggleCopyToCustomerState(value, 'phone');
                    }}
                    name='phone'
                    parse={value => value}
                    placeholder={tPlaceholder('no-placeholder')}
                />
            </FormControl>
            <FormControl>
                <InputLabel>{t('email-label')}</InputLabel>
                <PrefixedField
                    disabled={isDisabled}
                    className={cn('email-field')}
                    component={TextField}
                    callback={(value: string) => {
                        toggleCopyToCustomerState(value, 'email');
                    }}
                    name='email'
                    validate={composeValidators(emailValidator)}
                    parse={value => value}
                    placeholder={tPlaceholder('no-placeholder')}
                />
            </FormControl>
        </div>
    );
};
