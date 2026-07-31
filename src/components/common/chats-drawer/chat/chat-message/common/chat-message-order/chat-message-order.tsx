import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import { MessageOrder } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './chat-message-order.scss';

const cn = classname('chat-message-order');

const orderT = translateByNamespace('common:staff-table');

type ChatMessageOrderProps = {
    order: MessageOrder;
    time: string;
    isMine: boolean;
};

export const ChatMessageOrder = ({ order, isMine, time }: ChatMessageOrderProps) => {
    const router = useRouter();

    const handleOrderClick = useCallback(async () => {
        if (order) {
            const newQuery = { drawerParsedOrderId: order.publicId };

            await router.push({ pathname: '/loadboard', query: newQuery }, { pathname: '/available-orders', query: newQuery });
        }
    }, [order, router]);

    return (
        <div className={cn('', { mine: isMine })} onClick={handleOrderClick}>
            <span className={cn('details')}>
                {orderT('order')} {order?.orderId && `#${order.orderId}`}
            </span>
            <span>{time}</span>
        </div>
    );
};
