import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';

import { PaymentBrokerFeeAlert } from '@/components/client/orders/forms/common/payment-broker-fee-alert/payment-broker-fee-alert';
import { TotalPaymentAlert } from '@/components/client/orders/forms/common/total-payment-alert/total-payment-alert';
import { OrderMarkAsPaidFormContent } from '@/components/client/orders/forms/order-mark-as-paid-form/order-mark-as-paid-form';
import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { PaymentTermsSelect } from '@/components/common/payment-terms-select/payment-terms-select';
import { OrderPaymentStatus } from '@/enums/order-payment-status';
import { PaymentTerm } from '@/enums/payment-term';
import {CurrencyInput} from '@/fields/currency-input';
import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useDisableCarrierChanging, useIsPartnerCompany, useMeShipper } from '@hooks';
import { PlusIcon, TrashIcon } from '@icons';
import { useAppSelector } from '@store';
import { OrderFieldsGroup, orderPaymentStatusSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { CarrierPaymentInfoFields } from './carrier-payment-info-fields';
import { FreightXCarrierPaymentInfoFields } from './freightx-carrier-payment-info-fields';
import { useCarrierPaymentInfoLabels, useGetPaymentInformationValues, useGetPaymentValues } from './hooks';
import { OrderPaymentInformationFieldsWrapper } from './order-payment-information-fields-wrapper';

import './order-payment-information-fields-group.scss';

const t = translateByNamespace('client:order:payment-information');
const tPlaceholder = translateByNamespace('client:order:fields');
const cn = classname('order-payment-information-fields-group');

export const OrderPaymentInformationFieldsGroup = () => {
    const isMeShipper = useMeShipper();
    const isPartner = useIsPartnerCompany();
    const isDisabled = useDisableCarrierChanging();
    const paymentStatus = useAppSelector(orderPaymentStatusSelector);
    const { addTermsLabel } = useCarrierPaymentInfoLabels();
    const { payment, brokerFee, terms, delayedTerms, delayedPayment } = useGetPaymentInformationValues();
    const { paymentValues } = useGetPaymentValues();

    const { batch, change } = useForm();

    const [showDelayedTermField, setDelayedTermField] = useState<boolean>(false);
    const [showInstantField, setInstantTermField] = useState<boolean>(false);
    const [hasAddTermLink, setHasAddTermLink] = useState<boolean>(false);
    const [showBrokerFeeField, setBrokerFeeField] = useState<boolean>(false);

    useEffect(() => {
        if (delayedTerms || delayedPayment) {
            setDelayedTermField(true);
        }

        if (brokerFee) {
            setBrokerFeeField(true);
        }
    }, [brokerFee, delayedTerms, delayedPayment, terms, payment, showDelayedTermField, showInstantField]);

    useEffect(() => {
        if (!(showDelayedTermField && (terms || showInstantField)) && ((delayedTerms && !(terms || payment)) || (terms && !(delayedTerms || delayedPayment)))) {
            setHasAddTermLink(true);
        }
    }, [delayedTerms, delayedPayment, terms, payment, showDelayedTermField, showInstantField]);

    const isFulled = useMemo(() => paymentValues && paymentStatus && paymentStatus === OrderPaymentStatus.PAID, [paymentValues, paymentStatus]);

    const isBrokerFee = useMemo(
        () => !showDelayedTermField && (brokerFee || terms === PaymentTerm.COD || terms === PaymentTerm.COP),
        [brokerFee, terms, showDelayedTermField],
    );

    const handleBrokerFeeDelete = useCallback(() => {
        batch(() => {
            change(`${OrderFieldsGroup.PAYMENT_INFORMATION}.brokerFee`, null);
        });

        setBrokerFeeField(false);
    }, [batch, change]);

    const handleAfterDelayedFieldsDelete = useCallback(() => {
        setDelayedTermField(false);
        setBrokerFeeField(false);

        setHasAddTermLink(!!terms);
    }, [terms]);

    const handleAddTermLinkClick = useCallback(() => {
        if (delayedTerms) {
            setInstantTermField(true);
        } else {
            setDelayedTermField(true);
        }

        setHasAddTermLink(false);
    }, [delayedTerms]);

    const showAddTermLink = hasAddTermLink && !brokerFee && !(isBrokerFee && showBrokerFeeField);

    return (
        <>
            <FieldPrefix prefix={OrderFieldsGroup.PAYMENT_INFORMATION}>
                {isMeShipper && (
                    <OrderPaymentInformationFieldsWrapper title={t('client-payment-group-label')}>
                        <FormControl>
                            <InputLabel>{t('fields.amount')}</InputLabel>
                            <PrefixedField
                                component={CurrencyInput}
                                name='clientPrice'
                                startAdornment='$'
                                parse={value => value}
                                placeholder={tPlaceholder('no-placeholder')}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('fields.terms')}</InputLabel>
                            <PrefixedField
                                component={PaymentTermsSelect}
                                displayAllOptions={true}
                                disabledOtherOption={isPartner}
                                isClearable={false}
                                name='clientTerms'
                                adornment='$'
                                parse={value => value}
                                isSearchable={false}
                                placeholder={tPlaceholder('no-placeholder')}
                            />
                        </FormControl>
                    </OrderPaymentInformationFieldsWrapper>
                )}
                {renderProjectSpecificComponent(
                    {
                        OrderUshipperPaymentInfoFields: (
                            <div className={cn('payment-add-links-wrapper')}>
                                <CarrierPaymentInfoFields
                                    showDelayedTermField={showDelayedTermField}
                                    showInstantField={showInstantField}
                                    onAfterDelayedFieldsDelete={handleAfterDelayedFieldsDelete}
                                />
                                {!isDisabled && (
                                    <div className={cn('links')}>
                                        {showAddTermLink && (
                                            <Button view='link' active={true} size='mini' onClick={handleAddTermLinkClick}>
                                                <PlusIcon /> {addTermsLabel}
                                            </Button>
                                        )}
                                        {isBrokerFee && !showBrokerFeeField && (
                                            <Button view='link' active={true} size='mini' onClick={() => setBrokerFeeField(true)}>
                                                <PlusIcon /> {t('fields.add-broker-fee-btn')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                                {payment > 0 && delayedPayment && <TotalPaymentAlert payment={payment} delayedPayment={delayedPayment} />}
                                {isBrokerFee && showBrokerFeeField && (
                                    <div className={cn('broker-fee-alert-wrapper')}>
                                        <>
                                            <>
                                                <FormControl className='broker-fee'>
                                                    <InputLabel>{t('fields.broker-fee')}</InputLabel>
                                                    <PrefixedField
                                                        disabled={isDisabled}
                                                        startAdornment='$'
                                                        component={CurrencyInput}
                                                        name='brokerFee'
                                                        parse={value => value}
                                                        placeholder={tPlaceholder('no-placeholder')}
                                                    />
                                                </FormControl>
                                                {!isDisabled && <IconButton Icon={TrashIcon} onClick={handleBrokerFeeDelete} />}
                                            </>
                                            {payment > 0 && brokerFee && (
                                                <PaymentBrokerFeeAlert payment={payment} brokerFee={brokerFee} className='broker-fee-back-alert' />
                                            )}
                                        </>
                                    </div>
                                )}
                            </div>
                        ),
                        OrderFreightxPaymentInfoFields: <FreightXCarrierPaymentInfoFields onAfterDelayedFieldsDelete={handleAfterDelayedFieldsDelete} />,
                    },
                    'orderPaymentInfoFields',
                )}
                {!isMeShipper && !isPartner && (
                    <OrderPaymentInformationFieldsWrapper>
                        <FormControl>
                            <InputLabel>{t('fields.driver-pay')}</InputLabel>
                            <PrefixedField
                                component={CurrencyInput}
                                name='driverPay'
                                startAdornment='$'
                                parse={value => value}
                                placeholder={tPlaceholder('no-placeholder')}
                            />
                        </FormControl>
                    </OrderPaymentInformationFieldsWrapper>
                )}
                <FormControl>
                    <InputLabel>{t('fields.notes')}</InputLabel>
                    <PrefixedField component={TextField} name='notes' multiline={true} parse={value => value} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
                <Divider className={cn('divider')}>{t('drawer-divider-label')}</Divider>
                <FormControl>
                    <InputLabel>{t('fields.invoice-id')}</InputLabel>
                    <PrefixedField component={TextField} name='invoiceId' parse={value => value} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
                <FormControl>
                    <InputLabel>{t('fields.invoice-notes')}</InputLabel>
                    <PrefixedField
                        component={TextField}
                        name='invoiceNotes'
                        multiline={true}
                        parse={value => value}
                        placeholder={tPlaceholder('no-placeholder')}
                    />
                </FormControl>
            </FieldPrefix>
            {isFulled && (
                <FieldPrefix prefix={OrderFieldsGroup.PAYMENT}>
                    <OrderMarkAsPaidFormContent isPrefixedField={true} />
                </FieldPrefix>
            )}
        </>
    );
};
