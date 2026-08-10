import React from 'react';
import { useFormState } from 'react-final-form';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { PaymentTermsSelect } from '@/components/common/payment-terms-select/payment-terms-select';
import { DelayedPaymentTerm } from '@/enums/payment-term';
import {CurrencyInput} from '@/fields/currency-input';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {PrefixedField} from '@/fields/field-prefix';
import { useDisableCarrierChanging } from '@/hooks/order/use-disable-carrier-changing';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { OrderFormState } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { useGetPaymentInformationValues, useHandleDelayedFieldsDelete } from './hooks';
import { OrderPaymentInformationFieldsWrapper } from './order-payment-information-fields-wrapper';

import './order-payment-information-fields-group.scss';
import TrashIcon from '@/assets/icons/trash-can.svg';

const t = translateByNamespace('client:order:payment-information');
const tPlaceholder = translateByNamespace('client:order:fields');

export const FreightXCarrierPaymentInfoFields = ({ onAfterDelayedFieldsDelete }: { onAfterDelayedFieldsDelete: () => void }) => {
    const isDisabled = useDisableCarrierChanging();
    const isMePartner = useIsPartnerCompany();
    const { delayedTerms } = useGetPaymentInformationValues();
    const { handleDelayedFieldsDelete } = useHandleDelayedFieldsDelete(onAfterDelayedFieldsDelete);
    const { publicId } = useFormState<OrderFormState>().initialValues;

    return (
        <OrderPaymentInformationFieldsWrapper>
            <FormControl>
                <InputLabel required={true}>{t('fields.amount')}</InputLabel>
                <PrefixedField
                    component={CurrencyInput}
                    name='delayedPayment'
                    startAdornment='$'
                    parse={value => value}
                    placeholder={tPlaceholder('no-placeholder')}
                    disabled={isDisabled}
                    validate={required}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('fields.term')}</InputLabel>
                <PrefixedField
                    displayAllOptions={true}
                    component={PaymentTermsSelect}
                    isClearable={false}
                    disabledOtherOption={isMePartner}
                    name='delayedTerms'
                    values={DelayedPaymentTerm}
                    startAdornment='$'
                    parse={value => value}
                    isSearchable={false}
                    placeholder={tPlaceholder('no-placeholder')}
                    disabled={isDisabled || (!publicId && delayedTerms)}
                    validate={required}
                />
            </FormControl>

            {!isDisabled && <IconButton Icon={TrashIcon} onClick={handleDelayedFieldsDelete} />}
        </OrderPaymentInformationFieldsWrapper>
    );
};
