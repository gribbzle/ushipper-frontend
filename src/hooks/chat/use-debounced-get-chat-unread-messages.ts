import { useMemo } from 'react';
import { debounce } from 'debounce';

import { useAppDispatch } from '@store';
import { getChatMessagesAction } from '@store/common';

export const useDebouncedGetChatUnreadMessages = (chatId: string | null) => {
    const dispatch = useAppDispatch();

    return useMemo(
        () =>
            debounce(() => {
                if (chatId) {
                    dispatch(getChatMessagesAction({ chatId, isRead: false }));
                }
            }, 300),
        [dispatch, chatId],
    );
};
