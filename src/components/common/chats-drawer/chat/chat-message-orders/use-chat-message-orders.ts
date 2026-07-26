import { MouseEvent, useCallback } from 'react';

import { useOpenParsedOrderDetailsDrawer } from '@hooks';

export const useChatMessageOrders = () => {
    const { handleParsedOrderClick } = useOpenParsedOrderDetailsDrawer();

    const handleClick = useCallback(
        async (e: MouseEvent<HTMLSpanElement>, orderPublicId?: string) => {
            e.stopPropagation();

            if (orderPublicId) {
                handleParsedOrderClick(orderPublicId);
            }
        },
        [handleParsedOrderClick],
    );

    return { handleClick };
};
