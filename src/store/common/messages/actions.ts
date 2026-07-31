import { createAsyncThunk } from '@reduxjs/toolkit';

import { ChatTypesEnum } from '@/enums';
import { createSupportChat, fetchChats } from '@api';
import { RequestStatus } from '@utils/redux';

import { ChatShortInfo } from '../chats/types';

import {} from './selectors';
import { messagesActions } from './slice';

export const getSupportChatAction = createAsyncThunk<ChatShortInfo, { name?: string; accountId?: string } | void>(
    'chatsDrawer/getChats',
    async (params, { rejectWithValue, dispatch }) => {
        try {
            dispatch(messagesActions.setGetSupportChatRequestStatus(RequestStatus.PROCESSING));
            const query = params?.name || null;

            const result = await fetchChats(query, null, ChatTypesEnum.SUPPORT);
            const supportChats = result.data;

            if (supportChats.length > 0) {
                const foundChat = supportChats.find(chat => chat.account?.publicId === params?.accountId);

                if (foundChat) {
                    dispatch(messagesActions.setGetSupportChatRequestStatus(RequestStatus.SUCCESS));

                    return foundChat;
                }
            }
            const data = await createSupportChat(params?.accountId);

            dispatch(messagesActions.setGetSupportChatRequestStatus(RequestStatus.SUCCESS));

            return data;
        } catch (error) {
            dispatch(messagesActions.setGetSupportChatRequestStatus(RequestStatus.ERROR));

            return rejectWithValue(error);
        }
    },
);
