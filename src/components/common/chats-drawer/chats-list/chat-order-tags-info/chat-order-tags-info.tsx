import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { OrderStatus } from '@/enums/order-status';
import { useMeCarrier, useMeShipper } from '@/hooks/use-user-role-group';
import { ChatShortInfo } from '@store/common/chats/types';
import { translateByNamespace } from '@utils/i18n';
import { translateCarrierPostedOrderStatus, translateOrderStatus } from '@utils/translate/order/get-order-status-translate';

const t = translateByNamespace('common:chats');

export const ChatOrderTagsInfo = ({ chat, context = 'drawer' }: { chat: ChatShortInfo; context?: 'page' | 'drawer' }) => {
    const { order, orderOffer, orderRequest } = chat;
    const orderTagSize = context === 'page' ? 'medium' : undefined;

    const isCarrier = useMeCarrier();
    const isShipper = useMeShipper();

    return (
        <>
            {order && (
                <>
                    {isCarrier && order.status === OrderStatus.POSTED && (
                        <OrderTag size={orderTagSize} view={toKebabCase(order.status)}>
                            {translateCarrierPostedOrderStatus()}
                        </OrderTag>
                    )}
                    {isCarrier && order.status !== OrderStatus.POSTED && order.status !== OrderStatus.PENDING && (
                        <OrderTag size={orderTagSize} view={toKebabCase(order.status)}>
                            {translateOrderStatus(order.status)}
                        </OrderTag>
                    )}

                    {isShipper && (
                        <OrderTag size={orderTagSize} view={toKebabCase(order.status)}>
                            {translateOrderStatus(order.status)}
                        </OrderTag>
                    )}
                </>
            )}
            {isCarrier && order?.status === OrderStatus.POSTED && orderRequest && (
                <OrderTag size={orderTagSize} view='declined'>
                    {t('request')}
                </OrderTag>
            )}
            {isCarrier && orderOffer && (
                <OrderTag size={orderTagSize} view='pending'>
                    {t('offer')}
                </OrderTag>
            )}
        </>
    );
};
