import React from 'react';

import ContactInfoFooter from '@/components/client/orders/contact-info-footer/contact-info-footer';
import { OrderContactAddress } from '@/components/client/orders/forms/common/order-contact-address/order-contact-address';
import { OrderContactDetails } from '@/components/client/orders/forms/common/order-contact-details/order-contact-details';
import { BusinessTypesSelect } from '@/components/common/selects/business-types-select/business-types-select';
import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useDisableCarrierChanging, useMeCarrier, useMeShipper } from '@hooks';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-customer-information-fields-group.scss';

const t = translateByNamespace('client:order:customer-information');
const tMCNumberField = translateByNamespace('client:company-settings:fields');
const tBusinessType = translateByNamespace('client:company-page:company-info:fields');
const addressTranslate = translateByNamespace('client:order:contact-address-fields');
const cn = classname('order-customer-information-fields-group');

type Props = React.FormHTMLAttributes<HTMLFormElement | HTMLDivElement> & {
    hideContactInfoFooter?: boolean;
    disabledSwitch?: boolean;
};

export const OrderCustomerInformationFieldsGroup = (props: Props) => {
    const isMeShipper = useMeShipper();
    const isMeCarrier = useMeCarrier();
    const isDisabled = useDisableCarrierChanging();

    return (
        <FieldPrefix prefix={OrderFieldsGroup.CUSTOMER_INFORMATION}>
            <OrderContactAddress
                contactNameField='customerName'
                contactNameFieldTitle={isMeShipper ? addressTranslate('client-label') : addressTranslate('shipper-name-label')}
            />
            {isMeCarrier && (
                <>
                    <div className={cn('row')}>
                        <FormControl>
                            <InputLabel>{tMCNumberField('mcNumber')}</InputLabel>
                            <PrefixedField
                                name='mcNumber'
                                component={TextField}
                                placeholder={tMCNumberField('no-placeholder')}
                                parse={value => value}
                                disabled={isDisabled}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{tBusinessType('business-type')}</InputLabel>
                            <PrefixedField
                                name='businessType'
                                component={BusinessTypesSelect}
                                placeholder=''
                                parse={value => value ?? ''}
                                disabled={isDisabled}
                            />
                        </FormControl>
                    </div>
                </>
            )}

            <OrderContactDetails dividerLabel={t('drawer-divider-label')} />
            {!props.hideContactInfoFooter && <ContactInfoFooter hideCopyBtn={true} />}
        </FieldPrefix>
    );
};
