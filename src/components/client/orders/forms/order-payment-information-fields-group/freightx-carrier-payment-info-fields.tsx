import React from 'react';
import { useFormState } from 'react-final-form';

import { DelayedPaymentTerm } from '@/enums';
import { IconButton, PaymentTermsSelect } from '@components';
import { CurrencyInput, FormControl, InputLabel, PrefixedField } from '@fields';
import { useDisableCarrierChanging, useIsPartnerCompany } from '@hooks';
import { TrashIcon } from '@icons';
import { OrderFormState } from '@store/client';
import { translateByNamespace } from '@utils';
import { required } from '@validators';

import { useGetPaymentInformationValues, useHandleDelayedFieldsDelete } from './hooks';
import { OrderPaymentInformationFieldsWrapper } from './order-payment-information-fields-wrapper';

import './order-payment-information-fields-group.scss';

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
