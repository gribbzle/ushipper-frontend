import React from 'react';

import { useOrder, useOrderPaymentInformationHelpers } from '@/hooks/order';
import { getPaymentMethodTranslate, getPaymentTermTranslate } from '@/utils/payment';
import { DotLeader } from '@ui';
import { formatToCurrency, translateByNamespace } from '@utils';

import { DriverChargedFeeAlert } from '../../driver-charged-fee-alert';
import { DriverPayDotLeader } from '../../driver-pay-dot-leader';
import { useUshipperPayInformation } from '../useUshipperPayInformation';

import { useClientUshipperPayInformation } from './useClientUshipperPayInformation';

const t = translateByNamespace('client:order:payment-information');
const tFields = translateByNamespace('client:order:payment-information:fields');

export const ClientUshipperPayInformation = () => {
    const { status } = useOrder();
    const { driverDelayedPayment, driverInstantPayment, projectOrderPayText } = useUshipperPayInformation();
    const { instantTerms, instantMethod, isBothTermsOrder, isOnlyDelayedTermsOrder, formattedDriverFeeCharge } = useOrderPaymentInformationHelpers();
    const { showDriverChargedFeeAlert } = useClientUshipperPayInformation();

    return (
        <>
            {isOnlyDelayedTermsOrder && <DotLeader label={tFields('terms')} value={projectOrderPayText} />}
            {isBothTermsOrder && (
                <>
                    {instantTerms && (
                        <>
                            <DotLeader
                                label={tFields('driver-instant-payment')}
                                value={driverInstantPayment ? formatToCurrency(driverInstantPayment) : t('empty-value')}
                            />
                            <DotLeader label={tFields('driver-instant-terms')} value={getPaymentTermTranslate(instantTerms)} />
                            <DotLeader
                                label={tFields('driver-instant-method')}
                                value={instantMethod ? getPaymentMethodTranslate(instantMethod) : t('empty-value')}
                            />
                        </>
                    )}
                    <DriverPayDotLeader driverPay={driverDelayedPayment} label={tFields('driver-delayed-payment')} driverPaymentTerm='delayed' />
                    <DotLeader label={tFields('driver-delayed-terms')} value={projectOrderPayText} />
                </>
            )}
            {showDriverChargedFeeAlert && <DriverChargedFeeAlert orderStatus={status} fee={formattedDriverFeeCharge} />}
        </>
    );
};
