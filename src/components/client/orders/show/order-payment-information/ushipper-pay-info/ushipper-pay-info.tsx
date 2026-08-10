import React from 'react';

import { useOrderPaymentInformationHelpers } from '@/hooks/order';
import { useMeAdmin } from '@/hooks/use-user-role-group';
import { classname } from '@utils/classname';

import { BlockWrapper } from '../block-wrapper';
import { DriverPayDotLeader } from '../driver-pay-dot-leader';

import { AdminUshipperPayDetails } from './admin-ushipper-pay-details';
import { ClientUshipperPayInformation } from './client-ushipper-pay-details';
import { useUshipperPayInformation } from './useUshipperPayInformation';

import './ushipper-pay-info.scss';

const cn = classname('ushipper-pay-info');

export const UshipperPayInformation = () => {
    const isMeAdmin = useMeAdmin();
    const { isDanger, driverPay, projectOrderPayText } = useUshipperPayInformation();
    const { isBothTermsOrder, isInstantTermsOrder } = useOrderPaymentInformationHelpers();

    return (
        <div className={cn()}>
            <BlockWrapper
                title={projectOrderPayText}
                body={
                    <>
                        {!isBothTermsOrder && (
                            <DriverPayDotLeader
                                driverPay={driverPay}
                                isDangerStyle={isDanger}
                                driverPaymentTerm={isInstantTermsOrder ? 'instant' : 'delayed'}
                            />
                        )}
                        {!isMeAdmin && <ClientUshipperPayInformation />}
                        {isMeAdmin && <AdminUshipperPayDetails />}
                    </>
                }
            />
        </div>
    );
};
