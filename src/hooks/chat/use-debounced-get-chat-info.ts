import { useMemo } from 'react';
import { debounce } from 'debounce';

import { useAppDispatch } from '@store';
import { getChatInfoAction } from '@store/common';

export const useDebouncedGetChatInfo = (chatId: string | null) => {
    const dispatch = useAppDispatch();

    return useMemo(
        () =>
            debounce(() => {
                if (chatId) {
                    dispatch(getChatInfoAction(chatId));
                }
            }, 300),
        [dispatch, chatId],
    );
};
