import React from 'react';

import { useOrder, useOrderFees, useOrderHelpers, useOrderPaymentInformationHelpers } from '@/hooks/order';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { summarizeFees } from '@utils/transaction/summarize-fees';

import { DriverChargedFeeAlert } from '../../driver-charged-fee-alert';
import { DriverPayDotLeader } from '../../driver-pay-dot-leader';
import { PaymentFormAlert } from '../../payment-form-alert';
import { useUshipperPayInformation } from '../useUshipperPayInformation';
import { UshipperPayActions } from '../ushipper-pay-actions';

import { FeesInfoProps } from './admin-ushipper-pay-details.types';
import { useAdminUshipperPayDetails } from './useAdminUshipperPayDetails';

import './admin-ushipper-pay-details.scss';

const cn = classname('admin-ushipper-pay-details');

const FeesInfo = ({ fees, termLabel, driverPay, isDangerDriverPay, driverPaymentTerm }: FeesInfoProps) => (
    <>
        <h4 className={cn('group-title')}>{termLabel}</h4>
        <DriverPayDotLeader driverPay={driverPay} isDangerStyle={isDangerDriverPay} driverPaymentTerm={driverPaymentTerm} />
        {fees.map((fee, index) => (
            <DotLeader key={index} label={fee.label} value={fee.value} />
        ))}
    </>
);

const t = translateByNamespace('client:order:payment-information:fields');

export const AdminUshipperPayDetails = () => {
    const order = useOrder();
    const { isDanger, driverDelayedPayment, driverInstantPayment } = useUshipperPayInformation();
    const { isDeliveredOrder, isCarrierOrderType, receiptlessOrder } = useOrderHelpers();
    const { fundsTransferStatusData, formattedUsedFees, formattedDelayedFees, formattedInstantFees } = useAdminUshipperPayDetails();
    const { totalFeesAmount, delayedFees, instantFees, usedFees } = useOrderFees();
    const { isBothTermsOrder, isOnlyInstantTermsOrder, formattedDriverFeeCharge } = useOrderPaymentInformationHelpers();

    const { accounting, status } = order;

    return (
        <>
            {accounting && (
                <>
                    {isBothTermsOrder ? (
                        <>
                            {instantFees.length > 0 && (
                                <FeesInfo
                                    fees={formattedInstantFees}
                                    termLabel={t('instant-fees')}
                                    driverPay={driverInstantPayment ? formatToCurrency(driverInstantPayment) : undefined}
                                    isDangerDriverPay={isDanger}
                                    driverPaymentTerm='instant'
                                />
                            )}
                            {receiptlessOrder && <DriverChargedFeeAlert orderStatus={status} fee={formattedDriverFeeCharge} />}
                            {delayedFees.length > 0 && (
                                <FeesInfo
                                    fees={formattedDelayedFees}
                                    termLabel={t('delayed-fees')}
                                    driverPay={driverDelayedPayment}
                                    isDangerDriverPay={isDanger}
                                    driverPaymentTerm='delayed'
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {formattedUsedFees?.map((fee, index) => (
                                <DotLeader key={index} label={fee.label} value={fee.value} />
                            ))}
                        </>
                    )}

                    {!!usedFees?.length && <DotLeader label={t('total-fees')} value={`${totalFeesAmount} (${summarizeFees(usedFees)})`} />}
                </>
            )}
            {fundsTransferStatusData?.date && <DotLeader label={fundsTransferStatusData.label} value={fundsTransferStatusData.date} />}
            {isOnlyInstantTermsOrder && (
                <>
                    {isDeliveredOrder ? (
                        <PaymentFormAlert context='admin' />
                    ) : (
                        receiptlessOrder && <DriverChargedFeeAlert orderStatus={status} fee={formattedDriverFeeCharge} />
                    )}
                </>
            )}
            {isCarrierOrderType && <UshipperPayActions />}
        </>
    );
};
