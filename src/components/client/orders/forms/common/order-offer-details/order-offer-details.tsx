import React from 'react';
import { Field, useFormState } from 'react-final-form';

import { PaymentBrokerFeeAlert } from '@/components/client/orders/forms/common/payment-broker-fee-alert/payment-broker-fee-alert';
import { TotalPaymentAlert } from '@/components/client/orders/forms/common/total-payment-alert/total-payment-alert';
import { DateTypesSelect } from '@/components/client/orders/selects/date-types-select/date-types-select';
import { Divider } from '@/components/common/divider/divider';
import { PaymentMethod } from '@/enums/payment-method';
import { PaymentTerm } from '@/enums/payment-term';
import { getOrderTermWithMethod } from '@/utils/order';
import {CurrencyInput} from '@/fields/currency-input';
import {DatePicker} from '@/fields/datepicker';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import './order-offer-details.scss';

const t = translateByNamespace('client:orders-page:send-offer-to-carrier:form');
const cn = classname('order-offer-details');

type Props = {
    hideDivider?: boolean;
    terms?: PaymentTerm | null;
    delayedTerms?: PaymentTerm | null;
    method?: PaymentMethod | null;
    delayedMethod?: PaymentMethod | null;
};
export const OrderOfferDetails = ({ hideDivider, terms, method, delayedTerms, delayedMethod }: Props) => {
    const formState = useFormState();
    const { delayedPayment, brokerFee, carrierPrice } = formState.values;
    const { delayedPayment: initialDelayedPayment, brokerFee: initialBrokerFee } = formState.initialValues || {};

    return (
        <div className={cn()}>
            {!hideDivider && <Divider>{t('offer-details-divider')}</Divider>}
            <FormControl>
                <InputLabel required={true}>{t('carrier-pickup-at-label')}</InputLabel>
                <Field validate={required} component={DatePicker} name='carrierPickupAt' placeholder={t('placeholder')} parse={value => value} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('type-date-label')}</InputLabel>
                <Field validate={required} name='carrierPickupTypeDate' component={DateTypesSelect} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('carrier-delivery-at-label')}</InputLabel>
                <Field validate={required} component={DatePicker} name='carrierDeliveryAt' placeholder={t('placeholder')} parse={value => value} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('type-date-label')}</InputLabel>
                <Field validate={required} name='carrierDeliveryTypeDate' component={DateTypesSelect} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{delayedPayment ? t('instant-amount-label') : t('amount-label')}</InputLabel>
                <Field startAdornment='$' validate={required} component={CurrencyInput} name='carrierPrice' parse={value => value} />
                {terms && method && <span className={cn('payment-details')}>{getOrderTermWithMethod(terms, method)}</span>}
            </FormControl>
            {initialDelayedPayment && (
                <FormControl>
                    <InputLabel required={true}>{t('delayed-amount-label')}</InputLabel>
                    <Field
                        component={CurrencyInput}
                        name='delayedPayment'
                        startAdornment='$'
                        parse={value => value}
                        placeholder={t('no-placeholder')}
                        validate={required}
                    />
                    {delayedTerms && delayedMethod && <span className={cn('payment-details')}>{getOrderTermWithMethod(delayedTerms, delayedMethod)}</span>}
                </FormControl>
            )}
            {carrierPrice > 0 && delayedPayment && <TotalPaymentAlert payment={carrierPrice} delayedPayment={delayedPayment} className={cn('alert')} />}
            {initialBrokerFee && (
                <FormControl className='broker-fee'>
                    <InputLabel required={true}>{t('broker-fee')}</InputLabel>
                    <Field
                        startAdornment='$'
                        component={CurrencyInput}
                        name='brokerFee'
                        parse={value => value}
                        placeholder={t('no-placeholder')}
                        validate={required}
                    />
                </FormControl>
            )}
            {brokerFee && carrierPrice > 0 && <PaymentBrokerFeeAlert brokerFee={brokerFee} payment={carrierPrice} className={cn('alert')} />}
        </div>
    );
};
