import React, { useMemo } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@components';
import { MessageOrder } from '@store/common/chats/types';
import { classname, translateByNamespace } from '@utils';

import { useChatMessageOrders } from './use-chat-message-orders';

import './chat-message-orders.scss';

const t = translateByNamespace('common:staff-table');
const tMore = translateByNamespace('client:order-actions');

const cn = classname('chat-message-orders');

const removeDuplicates = (orders: MessageOrder[]): MessageOrder[] => {
    const seen = new Set();

    return orders.filter(order => {
        const duplicate = seen.has(order.publicId);

        seen.add(order.publicId);

        return !duplicate;
    });
};

const OrderInfo = ({ order, tooltip = false }: { order: MessageOrder; tooltip?: boolean }) => {
    const { handleClick } = useChatMessageOrders();
    const { publicId, orderId } = order;

    return (
        <span className={cn('details', { tooltip })} onClick={e => handleClick(e, publicId)}>
            {t('order')} {orderId && `#${orderId}`}
        </span>
    );
};

export const ChatMessageOrders = ({ messageOrders }: { messageOrders: MessageOrder[] }) => {
    const { firstTwoOrders, remainingOrders } = useMemo(() => {
        const uniqueOrders = removeDuplicates(messageOrders);

        return {
            firstTwoOrders: uniqueOrders.slice(0, 2),
            remainingOrders: uniqueOrders.slice(2),
        };
    }, [messageOrders]);

    return (
        <div className={cn()}>
            {firstTwoOrders.map(order => (
                <div className={cn('tag')} key={order.publicId}>
                    <OrderInfo order={order} />
                </div>
            ))}
            {remainingOrders.length > 1 ? (
                <Tooltip hideDelay={100}>
                    <TooltipTrigger asChild={true}>
                        <div className={cn('tag')}>
                            <span className={cn('details', { disabled: true })}>{tMore('more-button-title')}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className={cn('content')}>
                            {remainingOrders.map(order => (
                                <OrderInfo key={order.publicId} order={order} tooltip={true} />
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            ) : (
                remainingOrders.length === 1 && (
                    <div className={cn('tag')} key={remainingOrders[0].publicId}>
                        <OrderInfo order={remainingOrders[0]} />
                    </div>
                )
            )}
        </div>
    );
};
