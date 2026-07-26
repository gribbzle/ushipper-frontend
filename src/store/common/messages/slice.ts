import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RequestStatus } from '@utils';

import { DeleteChatMessagePopupPropsState, DriverChatSelectorPopupPropsState, MessagesSliceState, UpdateChatMessagePopupPropsState } from './types';

const initialState: MessagesSliceState = {
    chatsSearchText: '',
    getSupportChatRequest: {
        status: RequestStatus.NONE,
        nextCursor: null,
    },
    driverChatSelectorPopupProps: {
        isPopupOpened: false,
    },
    deleteChatMessagePopupProps: {
        isPopupOpened: false,
        chatId: null,
        messagePublicId: null,
    },
    updateChatMessagePopupProps: {
        isPopupOpened: false,
        chatId: null,
        messagePublicId: null,
        content: null,
    },
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setChatsSearchText: (state, action: PayloadAction<string>) => {
            state.chatsSearchText = action.payload;
        },
        setGetSupportChatRequestStatus: (state, action: PayloadAction<RequestStatus>) => {
            state.getSupportChatRequest.status = action.payload;
        },
        setDriverChatSelectorPopupProps: (state, action: PayloadAction<DriverChatSelectorPopupPropsState>) => {
            state.driverChatSelectorPopupProps = action.payload;
        },
        setDeleteChatMessagePopupProps: (state, action: PayloadAction<DeleteChatMessagePopupPropsState>) => {
            state.deleteChatMessagePopupProps = action.payload;
        },
        setUpdateChatMessagePopupProps: (state, action: PayloadAction<UpdateChatMessagePopupPropsState>) => {
            state.updateChatMessagePopupProps = action.payload;
        },
    },
});

export const messagesActions = messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
