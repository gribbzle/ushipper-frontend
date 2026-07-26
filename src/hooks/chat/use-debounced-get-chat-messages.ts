import { useMemo } from 'react';
import { debounce } from 'debounce';

import { useAppDispatch } from '@store';
import { getChatMessagesAction } from '@store/common';

export const useDebouncedGetChatMessages = (chatId: string | null) => {
    const dispatch = useAppDispatch();

    return useMemo(
        () =>
            debounce((callback?: () => void) => {
                if (chatId) {
                    dispatch(getChatMessagesAction({ chatId, isRead: true })).then(() => {
                        callback?.();
                    });
                }
            }, 300),
        [dispatch, chatId],
    );
};
