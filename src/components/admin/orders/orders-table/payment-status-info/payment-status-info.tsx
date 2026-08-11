import React, { useMemo } from 'react';

import { AttachmentItem } from '@/components/common/attachment-item/attachment-item';
import { useInstantPaymentAttachments } from '@/hooks/order/use-instant-payment-attachments';
import { useOrder } from '@/hooks/order/useOrder';
import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';
import { useOrderPaymentInformationHelpers } from '@/hooks/order/useOrderPaymentInformationHelpers';
import { ImageProvider } from '@/providers/ImageProvider';
import { classname } from '@utils/classname';

import { OrderDriverPaymentTag } from '../order-driver-payment-tag';
import { OrderFundsTransferStatusTag } from '../order-funds-transfer-status-tag';

import './payment-status-info.scss';

const cn = classname('payment-status-info');

export const PaymentStatusInfo = () => {
    const { fundsTransferStatus, publicId } = useOrder();
    const { isDeliveredOrder } = useOrderHelpers();
    const { isInstantCashPaymentMethod, isOnlyDelayedTermsOrder } = useOrderPaymentInformationHelpers();

    const showOrderDriverPaymentTag = useMemo(
        (): boolean => !isOnlyDelayedTermsOrder && !isInstantCashPaymentMethod && isDeliveredOrder,
        [isDeliveredOrder, isInstantCashPaymentMethod, isOnlyDelayedTermsOrder],
    );

    const { latestPaymentDocument } = useInstantPaymentAttachments(publicId);

    if (!fundsTransferStatus && !showOrderDriverPaymentTag) {
        return <>—</>;
    }

    return (
        <div className={cn()}>
            <div className={cn('', { column: true })}>
                {fundsTransferStatus && <OrderFundsTransferStatusTag inline={showOrderDriverPaymentTag} />}
                {showOrderDriverPaymentTag && <OrderDriverPaymentTag />}
            </div>
            {showOrderDriverPaymentTag && latestPaymentDocument && (
                <ImageProvider>
                    <AttachmentItem attachment={latestPaymentDocument} />
                </ImageProvider>
            )}
        </div>
    );
};
