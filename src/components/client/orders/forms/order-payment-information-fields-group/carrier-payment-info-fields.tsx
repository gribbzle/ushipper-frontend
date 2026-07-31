import React from 'react';
import { useFormState } from 'react-final-form';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { PaymentMethodsSelect } from '@/components/common/payment-methods-select/payment-methods-select';
import { PaymentTermsSelect } from '@/components/common/payment-terms-select/payment-terms-select';
import { CurrencyInput, FormControl, InputLabel, PrefixedField } from '@fields';
import { useDisableCarrierChanging, useIsPartnerCompany, useMeShipper } from '@hooks';
import { TrashIcon } from '@icons';
import { OrderFieldsGroup, OrderFormState } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import {
    useCarrierPaymentInfoFields,
    useCarrierPaymentInfoLabels,
    useGetPaymentInformationValues,
    useGetTermsGroup,
    useHandleDelayedFieldsDelete,
} from './hooks';
import { OrderPaymentInformationFieldsWrapper } from './order-payment-information-fields-wrapper';

import './order-payment-information-fields-group.scss';

type Props = {
    showDelayedTermField: boolean;
    showInstantField: boolean;
    onAfterDelayedFieldsDelete: () => void;
};

const t = translateByNamespace('client:order:payment-information');
const tPlaceholder = translateByNamespace('client:order:fields');
const cn = classname('order-payment-information-fields-group');

const isDelayedFieldRequired = (allValues: OrderFormState) => {
    const paymentInfo = allValues[OrderFieldsGroup.PAYMENT_INFORMATION];
    const isAnyFieldFilled = !!paymentInfo?.delayedPayment || !!paymentInfo?.delayedTerms || !!paymentInfo?.delayedMethod;

    return isAnyFieldFilled;
};

const validateDelayedFields = (value: any, allValues: OrderFormState) => (isDelayedFieldRequired(allValues) ? required(value) : undefined);

export const CarrierPaymentInfoFields = ({ showDelayedTermField, showInstantField, onAfterDelayedFieldsDelete }: Props) => {
    const isMeShipper = useMeShipper();
    const isDisabled = useDisableCarrierChanging();
    const isMePartner = useIsPartnerCompany();
    const allValues = useFormState().values;
    const isDelayedPaymentFieldsRequired = isDelayedFieldRequired(allValues);

    const { termLabel, delayedTermLabel } = useCarrierPaymentInfoLabels();
    const { termsGroup, delayedTermsGroup } = useGetTermsGroup();
    const { terms, delayedTerms } = useGetPaymentInformationValues();

    const { handleDelayedFieldsDelete } = useHandleDelayedFieldsDelete(onAfterDelayedFieldsDelete);

    useCarrierPaymentInfoFields();

    return (
        <div className={cn('wrapper')}>
            {(!(!terms && delayedTerms) || showInstantField) && (
                <OrderPaymentInformationFieldsWrapper title={isMeShipper ? t('carrier-payment-group-label') : ''}>
                    <FormControl>
                        <InputLabel required={true}>{t('fields.amount')}</InputLabel>
                        <PrefixedField
                            name='payment'
                            parse={value => value}
                            component={CurrencyInput}
                            startAdornment='$'
                            placeholder={tPlaceholder('no-placeholder')}
                            disabled={isDisabled}
                            validate={required}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{termLabel}</InputLabel>
                        <PrefixedField
                            disabled={isDisabled}
                            displayAllOptions={true}
                            component={PaymentTermsSelect}
                            values={termsGroup}
                            disabledOtherOption={isMePartner}
                            isClearable={false}
                            name='terms'
                            startAdornment='$'
                            parse={value => value}
                            isSearchable={false}
                            placeholder={tPlaceholder('no-placeholder')}
                            validate={required}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{t('fields.method')}</InputLabel>
                        <PrefixedField
                            disabled={isDisabled}
                            displayAllOptions={true}
                            component={PaymentMethodsSelect}
                            isClearable={false}
                            name='method'
                            adornment='$'
                            parse={value => value}
                            isSearchable={false}
                            placeholder={tPlaceholder('no-placeholder')}
                            selectedPaymentTerm={terms}
                            validate={required}
                        />
                    </FormControl>
                </OrderPaymentInformationFieldsWrapper>
            )}
            {showDelayedTermField && (
                <OrderPaymentInformationFieldsWrapper>
                    <FormControl>
                        <InputLabel required={isDelayedPaymentFieldsRequired}>{t('fields.amount')}</InputLabel>
                        <PrefixedField
                            component={CurrencyInput}
                            name='delayedPayment'
                            startAdornment='$'
                            parse={value => value}
                            placeholder={tPlaceholder('no-placeholder')}
                            disabled={isDisabled}
                            validate={(value, allValues) => validateDelayedFields(value, allValues)}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={isDelayedPaymentFieldsRequired}>{delayedTermLabel}</InputLabel>
                        <PrefixedField
                            displayAllOptions={true}
                            component={PaymentTermsSelect}
                            isClearable={false}
                            disabledOtherOption={isMePartner}
                            name='delayedTerms'
                            values={delayedTermsGroup}
                            startAdornment='$'
                            parse={value => value}
                            isSearchable={false}
                            placeholder={tPlaceholder('no-placeholder')}
                            disabled={isDisabled}
                            validate={(value, allValues) => validateDelayedFields(value, allValues)}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={isDelayedPaymentFieldsRequired}>{t('fields.method')}</InputLabel>
                        <PrefixedField
                            displayAllOptions={true}
                            component={PaymentMethodsSelect}
                            isClearable={false}
                            name='delayedMethod'
                            adornment='$'
                            parse={value => value}
                            isSearchable={false}
                            placeholder={tPlaceholder('no-placeholder')}
                            selectedPaymentTerm={delayedTerms}
                            disabled={isDisabled}
                            validate={(value, allValues) => validateDelayedFields(value, allValues)}
                        />
                    </FormControl>
                    {!isDisabled && <IconButton Icon={TrashIcon} onClick={handleDelayedFieldsDelete} />}
                </OrderPaymentInformationFieldsWrapper>
            )}
        </div>
    );
};
