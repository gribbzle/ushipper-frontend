import React, { useCallback, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { useRouter } from 'next/router';

import { ChatTypesEnum, OrderStatus } from '@/enums';
import { getPaymentTermTranslate } from '@/utils/payment';
import { Button, OrderTag } from '@components';
import { useMeCarrier, useMeDriverRelated, useMeShipper } from '@hooks';
import { GeoLocationIcon } from '@icons';
import { useAppSelector } from '@store';
import { ChatShortInfo } from '@store/common/chats/types';
import { authorizedUserTwilioPhoneSelector } from '@store/global';
import {
    classname,
    formatExternalPhoneNumber,
    formatInternationalPhoneNumber,
    translateByNamespace,
    translateCarrierPostedOrderStatus,
    translateOrderStatus,
} from '@utils';

import { CallButtonBlock } from '../call-button-block';
import { ChatMessageOrders } from '../chat-message-orders';

import { SupportChatHead } from './support-chat-head';

import './chat-head.scss';

const t = translateByNamespace('common:chats');
const cn = classname('chat-head');

type ChatHeadProps = {
    chatInfo?: ChatShortInfo | null;
    mode?: 'drawer' | 'order-page';
    isMessagesPage?: boolean;
    showCallButton: boolean;
    headerComponent?: React.ReactNode;
    formatAsExternal?: boolean;
};

export const ChatHead = ({ chatInfo, mode = 'drawer', isMessagesPage = false, showCallButton, headerComponent, formatAsExternal = false }: ChatHeadProps) => {
    const router = useRouter();
    const isDriver = useMeDriverRelated();
    const authorizedUserTwilioPhone = useAppSelector(authorizedUserTwilioPhoneSelector);

    const handleShowDriverLocation = useCallback(
        (orderId: string) => {
            window.open(`${router.basePath}/tracking?orderId=${orderId}`, '_blank');
        },
        [router],
    );

    const handleShowOrder = useCallback(
        (publicId: string) => {
            window.open(`${router.basePath}/orders/${publicId}`, '_blank');
        },
        [router],
    );
    const isCarrier = useMeCarrier();
    const isShipper = useMeShipper();
    const isSupportChat = chatInfo?.type === ChatTypesEnum.SUPPORT;

    const chatHead = useMemo(() => {
        if (isSupportChat) {
            return <SupportChatHead driverAccount={chatInfo?.account} />;
        }

        let content = null;

        if (chatInfo && chatInfo.order) {
            const {
                order: {
                    publicId,
                    orderId,
                    paymentInformation: { terms, payment },
                    type,
                },
            } = chatInfo;
            const disableOrderLink = isCarrier && type === 'shipper' && !chatInfo?.order?.carrierOrder;

            if (mode === 'drawer') {
                content = (
                    <div className={cn('content')}>
                        <div className={cn('info-order')}>
                            <h4>
                                {t('order-chat-title')} {headerComponent}
                            </h4>
                            <div className={cn('info-order-details')}>
                                <div
                                    className={cn('info-order-details-link', { disabled: disableOrderLink })}
                                    onClick={disableOrderLink ? undefined : () => handleShowOrder(publicId)}
                                >
                                    <span>
                                        ID: {orderId} &nbsp;
                                        {payment && (
                                            <>
                                                ${payment} ({getPaymentTermTranslate(terms)})
                                            </>
                                        )}
                                    </span>
                                </div>
                                {chatInfo.order && (
                                    <>
                                        {isCarrier && chatInfo.order.status === OrderStatus.POSTED && (
                                            <OrderTag view={toKebabCase(chatInfo.order.status)}>{translateCarrierPostedOrderStatus()}</OrderTag>
                                        )}
                                        {isCarrier && chatInfo.order.status !== OrderStatus.POSTED && chatInfo.order.status !== OrderStatus.PENDING && (
                                            <OrderTag view={toKebabCase(chatInfo.order.status)}>{translateOrderStatus(chatInfo.order.status)}</OrderTag>
                                        )}

                                        {isShipper && (
                                            <OrderTag view={toKebabCase(chatInfo.order.status)}>{translateOrderStatus(chatInfo.order.status)}</OrderTag>
                                        )}
                                    </>
                                )}
                                {isCarrier && chatInfo.orderRequest && <OrderTag view='declined'>{t('request')}</OrderTag>}
                                {isCarrier && chatInfo.orderOffer && <OrderTag view='pending'>{t('offer')}</OrderTag>}
                            </div>
                        </div>
                        {chatInfo.order.driverId && !isDriver && (
                            <Button view='primary' size='small' plain={true} onClick={() => handleShowDriverLocation(orderId)}>
                                <GeoLocationIcon />
                                {t('driver-location')}
                            </Button>
                        )}
                    </div>
                );
            }
        } else if (chatInfo && chatInfo.externalNumber) {
            if (mode === 'drawer') {
                content = (
                    <div className={cn('content')}>
                        <div className={cn('info-orders')}>
                            <h4>
                                {formatAsExternal
                                    ? formatExternalPhoneNumber(chatInfo.externalNumber)
                                    : formatInternationalPhoneNumber(chatInfo.externalNumber)}
                            </h4>
                            {chatInfo.messageOrders && <ChatMessageOrders messageOrders={chatInfo.messageOrders} />}
                        </div>
                        {showCallButton && authorizedUserTwilioPhone && <CallButtonBlock phone={chatInfo.externalNumber} />}
                    </div>
                );
            }
        } else {
            return null;
        }

        return content ? <div className={cn('info', { mode, 'messages-page': isMessagesPage })}>{content}</div> : null;
    }, [
        isSupportChat,
        chatInfo,
        mode,
        isMessagesPage,
        isCarrier,
        headerComponent,
        isShipper,
        isDriver,
        handleShowOrder,
        handleShowDriverLocation,
        formatAsExternal,
        showCallButton,
        authorizedUserTwilioPhone,
    ]);

    return <>{chatHead}</>;
};
