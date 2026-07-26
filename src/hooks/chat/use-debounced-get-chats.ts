import { useMemo } from 'react';
import { debounce } from 'debounce';
import { PayloadAction } from '@reduxjs/toolkit';

import { ChatTypesEnum } from '@/enums';
import { useAppDispatch } from '@store';
import { chatsActions, getChatsAction } from '@store/common';
import { ChatShortInfo } from '@store/common/chats/types';

export const useDebouncedGetChats = (type?: ChatTypesEnum) => {
    const dispatch = useAppDispatch();

    return useMemo(
        () =>
            debounce((searchText?: string, isNeedReset?: boolean) => {
                dispatch(getChatsAction({ searchText, isNeedReset, type })).then(({ payload }: PayloadAction<unknown>) => {
                    if (isNeedReset) {
                        const firstChat = (payload as ChatShortInfo[])[0];
                        let chatId = null;

                        if (firstChat) {
                            chatId = firstChat.publicId;
                        }

                        dispatch(chatsActions.setSelectedChatId(chatId));
                    }
                });
            }, 300),
        [dispatch, type],
    );
};
