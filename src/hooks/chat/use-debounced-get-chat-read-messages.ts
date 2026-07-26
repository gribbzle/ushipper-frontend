import { useMemo } from 'react';
import { debounce } from 'debounce';

import { useAppDispatch } from '@store';
import { readMessageAction } from '@store/common';

export const useDebouncedGetChatReadMessages = (chatId: string | null) => {
    const dispatch = useAppDispatch();

    return useMemo(
        () =>
            debounce((messagePublicId: string, callback?: () => void) => {
                if (chatId) {
                    dispatch(readMessageAction({ chatId, messagePublicId })).then(() => {
                        callback?.();
                    });
                }
            }, 300),
        [chatId, dispatch],
    );
};
