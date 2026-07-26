import React, { Fragment, useMemo } from 'react';
import { format } from 'date-fns';

import { SystemMessagesTypesEnum } from '@/enums/system-messages-type';
import { getFinalPaymentAmount } from '@/utils/payment';
import {
    ChatMessage as ChatMessageType,
    OrderDriverAddedSystemMessagePayload,
    OrderDriverUpdatedSystemMessagePayload,
    OrderOfferRequestSysMessage,
} from '@store/common/chats/types';
import { formatToCurrency, translateByNamespace } from '@utils';

const systemMessages = translateByNamespace('client:order:system-messages');
const externalStatusMessages = translateByNamespace('client:order:external-status-messages');

export default function useMessageContent({
    content,
    systemMessageType,
    creator,
    systemMessagePayload,
    externalStatus,
}: Pick<ChatMessageType, 'content' | 'systemMessageType' | 'creator' | 'systemMessagePayload' | 'externalStatus'>) {
    return useMemo(() => {
        let messageContent = content;

        if (
            systemMessageType &&
            [
                SystemMessagesTypesEnum.orderOfferCreated,
                SystemMessagesTypesEnum.orderOfferAccepted,
                SystemMessagesTypesEnum.orderOfferRejected,
                SystemMessagesTypesEnum.orderOfferCanceled,
                SystemMessagesTypesEnum.orderRequestCreated,
                SystemMessagesTypesEnum.orderRequestRejected,
                SystemMessagesTypesEnum.orderRequestCanceled,
            ].includes(systemMessageType)
        ) {
            const payload = systemMessagePayload as OrderOfferRequestSysMessage;

            const payloadInfo = payload.orderRequest || payload.orderOffer;

            const totalPrice = getFinalPaymentAmount(payloadInfo?.paymentPrice, payloadInfo?.delayedPayment, payloadInfo?.brokerFee);

            messageContent = systemMessages<string>(systemMessageType, {
                creatorName: creator?.name || '',
                companyName: creator?.companyName || '',
                price: formatToCurrency(totalPrice),
                pickedAt: payloadInfo?.pickupAt ? format(new Date(payloadInfo.pickupAt), 'MMM d') : '',
                deliveryAt: payloadInfo?.deliveryAt ? format(new Date(payloadInfo.deliveryAt), 'MMM d') : '',
            });
        }

        if (systemMessageType && [SystemMessagesTypesEnum.driverAdded, SystemMessagesTypesEnum.orderDriverDeleted].includes(systemMessageType)) {
            messageContent = systemMessages<string>(systemMessageType, {
                creatorName: creator?.name || '',
                driverName: (systemMessagePayload as OrderDriverAddedSystemMessagePayload)?.driver.name || '',
            });
        }

        if (systemMessageType === SystemMessagesTypesEnum.orderDriverUpdated) {
            messageContent = systemMessages<string>(SystemMessagesTypesEnum.orderDriverUpdated, {
                creatorName: creator?.name || '',
                prevDriverName: (systemMessagePayload as OrderDriverUpdatedSystemMessagePayload)?.prevDriver.name || '',
                newDriverName: (systemMessagePayload as OrderDriverUpdatedSystemMessagePayload)?.newDriver.name || '',
            });
        }

        if (externalStatus && !content) {
            messageContent = externalStatusMessages<string>(externalStatus, {
                status: externalStatus,
            });
        }

        if (!messageContent) {
            return null;
        }

        return messageContent.split('\n').map((line, index) => (
            <Fragment key={index}>
                {index !== 0 && <br />}
                {line}
            </Fragment>
        ));
    }, [content, systemMessageType, creator, systemMessagePayload, externalStatus]);
}
