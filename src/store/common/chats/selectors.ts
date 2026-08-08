import { AppState } from "@store";
import { RequestStatus } from '@utils/redux';

import { SupportChatDrawerPropsState } from './types';

export const chatsSelector = (state: AppState) => state.common.chats;

export const chatsNextCursorSelector = (state: AppState) => {
    const { getChatsRequest } = chatsSelector(state);

    return getChatsRequest.nextCursor;
};

export const isChatsDrawerOpenSelector = (state: AppState) => {
    const { isDrawerOpen, needToReset, setSelectedAtTop } = chatsSelector(state);

    return {
        isDrawerOpen,
        needToReset,
        setSelectedAtTop,
    };
};

export const drawerChatsSelector = (state: AppState) => {
    const { drawerChats } = chatsSelector(state);

    return drawerChats;
};

export const getChatsRequestSelector = (state: AppState) => {
    const { getChatsRequest } = chatsSelector(state);

    return getChatsRequest;
};

export const selectedChatIdSelector = (state: AppState) => {
    const { drawerSelectedChatId } = chatsSelector(state);

    return drawerSelectedChatId;
};

export const chatMessagesNextCursorSelector = (chatId: string, isRead: boolean) => (state: AppState) => {
    const { chats } = chatsSelector(state);
    const chat = chats[chatId];

    if (!chat) {
        return null;
    }

    if (isRead) {
        return chat.getChatMessagesRequest.nextCursor;
    }

    return chat.getChatUnreadMessagesRequest.nextCursor;
};

export const chatUnreadMessagesNextCursorSelector = (chatId: string) => (state: AppState) => {
    const { chats } = chatsSelector(state);

    return chats[chatId]?.getChatUnreadMessagesRequest.nextCursor;
};

export const chatMessagesSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return null;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.messages || [];
};

export const chatUnreadMessagesSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return [];
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.unreadMessages || [];
};

export const chatMessagesRequestSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return null;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.getChatMessagesRequest || null;
};

export const chatUnreadMessagesRequestSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return null;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.getChatUnreadMessagesRequest || null;
};

export const chatInfoSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return null;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.info;
};

export const sendMessageRequestStatusSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return RequestStatus.NONE;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.sendMessageRequest?.status || RequestStatus.NONE;
};

export const deleteMessageRequestStatusSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return RequestStatus.NONE;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.deleteMessageRequest?.status || RequestStatus.NONE;
};

export const isChatInitiazedSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return RequestStatus.NONE;
    }
    const { chats } = chatsSelector(state);

    return !!chats[chatId];
};

export const lastReadMessageIdSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return null;
    }
    const { chats } = chatsSelector(state);

    return chats[chatId]?.lastReadMessageId;
};

export const chatTypeChatSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return;
    }
    const chats = drawerChatsSelector(state);

    return chats.find(chat => chat.publicId === chatId)?.type;
};

export const chatExternalNumberSelector = (chatId: string | null) => (state: AppState) => {
    if (!chatId) {
        return;
    }
    const chats = drawerChatsSelector(state);

    return chats.find(chat => chat.publicId === chatId)?.externalNumber;
};

export const driverSupportChatSelector = (state: AppState) => {
    const { driverSupportChat } = chatsSelector(state);

    return driverSupportChat;
};

export const supportChatDrawerPropsSelector = (state: AppState): SupportChatDrawerPropsState => {
    const { supportChatDrawerProps } = chatsSelector(state);

    return supportChatDrawerProps;
};
