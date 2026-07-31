import React from 'react';

import ContactInfoFooter from '@/components/client/orders/contact-info-footer/contact-info-footer';
import { OrderContactAddress } from '@/components/client/orders/forms/common/order-contact-address/order-contact-address';
import { OrderContactDetails } from '@/components/client/orders/forms/common/order-contact-details/order-contact-details';
import { DateTypesSelect } from '@/components/client/orders/selects/date-types-select/date-types-select';
import { DatePicker, FieldPrefix, FormControl, InputLabel, PrefixedField, StringInput } from '@fields';
import { useMeShipper } from '@hooks';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-pickup-information-fields-group.scss';

const t = translateByNamespace('client:order:pickup-information');
const tPlaceholder = translateByNamespace('client:order:fields');
const offerTranslate = translateByNamespace('client:orders-page:send-offer-to-carrier:form');
const cn = classname('order-pickup-information-fields-group');

type Props = React.FormHTMLAttributes<HTMLFormElement | HTMLDivElement> & {
    hideContactInfoFooter?: boolean;
};

export const OrderPickupInformationFieldsGroup = (props: Props) => {
    const isMeShipper = useMeShipper();

    return (
        <FieldPrefix prefix={OrderFieldsGroup.PICKUP_INFORMATION}>
            <OrderContactAddress contactNameField='businessName' className={cn('contact-address')} requiredFields={['city', 'state', 'zip']} />
            <FormControl className={cn('scheduled-pickup-date-field')}>
                <InputLabel>{t('fields.scheduled-pickup-at-label')}</InputLabel>
                <PrefixedField component={DatePicker} name='scheduledPickupAt' parse={value => value} placeholder={tPlaceholder('no-placeholder')} />
            </FormControl>
            {isMeShipper && (
                <FormControl className={cn('date-type')}>
                    <InputLabel>{offerTranslate('type-date-label')}</InputLabel>
                    <PrefixedField name='pickupDateType' component={DateTypesSelect} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
            )}
            <PrefixedField
                className={cn('buyer-number-field')}
                label={t('fields.buyer-number-label')}
                component={StringInput}
                name='buyerNumber'
                parse={value => value}
                placeholder={tPlaceholder('no-placeholder')}
            />
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
            <OrderContactDetails className={cn('contact-details')} dividerLabel={t('divider-label')} />
            {!props.hideContactInfoFooter && <ContactInfoFooter />}
        </FieldPrefix>
    );
};
