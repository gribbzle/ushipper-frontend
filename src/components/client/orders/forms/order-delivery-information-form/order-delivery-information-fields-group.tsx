import React from 'react';

import ContactInfoFooter from '@/components/client/orders/contact-info-footer/contact-info-footer';
import { OrderContactAddress } from '@/components/client/orders/forms/common/order-contact-address/order-contact-address';
import { OrderContactDetails } from '@/components/client/orders/forms/common/order-contact-details/order-contact-details';
import { DateTypesSelect } from '@/components/client/orders/selects/date-types-select/date-types-select';
import {DatePicker} from '@/fields/datepicker';
import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {StringInput} from '@/fields/string-input';
import { useMeShipper } from '@/hooks/use-user-role-group';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-delivery-information-fields-group.scss';

const t = translateByNamespace('client:order');
const offerDrawer = translateByNamespace('client:orders-page:send-offer-to-carrier:form');
const tPlaceholder = translateByNamespace('client:order:fields');
const cn = classname('order-delivery-information-fields-group');

type Props = {
    hideContactInfoFooter?: boolean;
};

export const OrderDeliveryInformationFieldsGroup = (props: Props) => {
    const isMeShipper = useMeShipper();

    return (
        <FieldPrefix prefix={OrderFieldsGroup.DELIVERY_INFORMATION}>
            <OrderContactAddress contactNameField='businessName' className={cn('contact-address')} requiredFields={['city', 'state', 'zip']} />
            <FormControl className={cn('scheduled-delivery-at-field')}>
                <InputLabel>{t('fields.scheduled-delivery-at-label')}</InputLabel>
                <PrefixedField component={DatePicker} name='scheduledDeliveryAt' parse={value => value} placeholder={tPlaceholder('no-placeholder')} />
            </FormControl>
            {isMeShipper && (
                <FormControl className={cn('date-type')}>
                    <InputLabel>{offerDrawer('type-date-label')}</InputLabel>
                    <PrefixedField name='deliveryDateType' component={DateTypesSelect} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
            )}
            <PrefixedField
                className={cn('notes-field')}
                label={t('fields.notes-label')}
                component={StringInput}
                name='notes'
                textarea={true}
                resize='none'
                parse={value => value}
                placeholder={tPlaceholder('no-placeholder')}
            />
            <OrderContactDetails className={cn('contact-details')} dividerLabel={t('delivery-information.drawer-divider-label')} />
            {!props.hideContactInfoFooter && <ContactInfoFooter />}
        </FieldPrefix>
    );
};
