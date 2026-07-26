import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChatFullInfo, ChatMessage, ChatShortInfo, SupportChatDrawerPropsState } from '@store/common/chats/types';
import { RequestStatus } from '@utils';

import { ChatsDrawerSliceState } from './types';

const getChatInitialState = (chatId: string | null): ChatFullInfo => ({
    chatId,
    info: null,
    messages: null,
    unreadMessages: null,

    /*
        Указывает на сообщение, после которого нужно вывести текст "Новые сообщения",
        т.к. по задумке, оно должно быть фиксированное в при открытии чата и изменяться только,
        в момент отправки сообщения и появляться, если в момент прихода нового сообщения до этого
        не отображалась.
    */
    lastReadMessageId: null,

    getChatRequest: {
        status: RequestStatus.NONE,
    },
    getChatMessagesRequest: {
        status: RequestStatus.NONE,
        nextCursor: null,
    },
    getChatUnreadMessagesRequest: {
        status: RequestStatus.NONE,
        nextCursor: null,
    },
    sendMessageRequest: {
        status: RequestStatus.NONE,
    },
    deleteMessageRequest: {
        status: RequestStatus.NONE,
    },
    readMessageRequest: {
        status: RequestStatus.NONE,
    },
});

const initialState: ChatsDrawerSliceState = {
    isDrawerOpen: false,
    needToReset: false,
    setSelectedAtTop: false,
    drawerSelectedChatId: null,
    drawerChats: [],
    getChatsRequest: {
        status: RequestStatus.NONE,
        nextCursor: null,
    },
    getChatIdByOrderIdRequest: {
        status: RequestStatus.NONE,
    },

    chats: {},
    driverSupportChat: null,
    supportChatDrawerProps: {
        isVisible: false,
        accountId: null,
        accountName: null,
    },
};

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setIsDrawerOpen: (
            state,
            action: PayloadAction<{
                isDrawerOpen: boolean;
                needToReset: boolean;
                setSelectedAtTop?: boolean;
            }>,
        ) => {
            state.isDrawerOpen = action.payload.isDrawerOpen;
            state.needToReset = action.payload.needToReset;
            state.setSelectedAtTop = !!action.payload.setSelectedAtTop;
        },

        setGetChatsRequestStatus: (state, action: PayloadAction<RequestStatus>) => {
            state.getChatsRequest.status = action.payload;
        },
        setGetChatIdByOrderIdRequests: (state, action: PayloadAction<RequestStatus>) => {
            state.getChatIdByOrderIdRequest.status = action.payload;
        },
        setDrawersChats: (state, action: PayloadAction<ChatShortInfo[]>) => {
            state.drawerChats = action.payload;
        },
        appendDrawersChats: (state, action: PayloadAction<ChatShortInfo[]>) => {
            const newChats = action.payload.filter(({ publicId }) => !state.drawerChats.find(chat => chat.publicId === publicId));

            state.drawerChats.push(...newChats);
        },
        prependDrawersChats: (state, action: PayloadAction<{ chat: ChatShortInfo; moveAtTop?: boolean }>) => {
            const { chat, moveAtTop } = action.payload;

            const chatIndex = state.drawerChats.findIndex(existingChat => existingChat.publicId === chat.publicId);

            if (chatIndex === -1) {
                state.drawerChats.unshift(chat);
            } else if (moveAtTop) {
                const existingChat = state.drawerChats.splice(chatIndex, 1)[0];

                state.drawerChats.unshift(existingChat);
            }
        },
        setChatsNextCursor: (state, action: PayloadAction<string | null>) => {
            state.getChatsRequest.nextCursor = action.payload;
        },
        initializeChatState: (state, action: PayloadAction<string>) => {
            state.chats[action.payload] = getChatInitialState(action.payload);
        },
        setSelectedChatId: (state, action: PayloadAction<string | null>) => {
            state.drawerSelectedChatId = action.payload;
        },

        setGetChatRequestStatus: (state, action: PayloadAction<{ chatId: string; status: RequestStatus }>) => {
            const { chatId, status } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.getChatRequest.status = status;
            }
        },
        setChatInfo: (state, action: PayloadAction<{ chatId: string; info: ChatShortInfo }>) => {
            const { chatId, info } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.info = info;
            }
        },

        setChatMessagesRequestStatus: (state, action: PayloadAction<{ chatId: string; status: RequestStatus; isRead: boolean }>) => {
            const { chatId, status, isRead } = action.payload;
            const chat = state.chats[chatId];

            if (!chat) {
                return state;
            }

            if (isRead) {
                chat.getChatMessagesRequest.status = status;

                return state;
            }

            chat.getChatUnreadMessagesRequest.status = status;
        },
        appendMessagesToChat: (
            state,
            action: PayloadAction<{
                chatId: string;
                isRead: boolean;
                messages: ChatMessage[];
                insertToEnd?: boolean;
                insertFromWebsocket?: boolean;
            }>,
        ) => {
            const { chatId, isRead, insertToEnd, insertFromWebsocket, messages } = action.payload;
            const chat = state.chats[chatId];

            if (!chat) {
                return state;
            }

            const uniqueMessages = messages.filter(
                newMessage =>
                    !chat.messages?.some(existingMessage => existingMessage.publicId === newMessage.publicId) &&
                    !chat.unreadMessages?.some(existingMessage => existingMessage.publicId === newMessage.publicId),
            );

            if (isRead) {
                if (!chat?.messages) {
                    chat.messages = [];
                }
                if (insertToEnd) {
                    chat.messages = [...chat.messages, ...uniqueMessages.reverse()];
                } else {
                    chat.messages = [...uniqueMessages.reverse(), ...chat.messages];
                }

                return state;
            }

            if (!chat?.unreadMessages) {
                chat.unreadMessages = [];
            }
            if (!insertFromWebsocket || (insertFromWebsocket && !chat.getChatUnreadMessagesRequest.nextCursor)) {
                if (insertToEnd) {
                    chat.unreadMessages = [...chat.unreadMessages, ...uniqueMessages];
                } else {
                    chat.unreadMessages = [...uniqueMessages, ...chat.unreadMessages];
                }
            }
        },
        deleteMessageFromChat: (
            state,
            action: PayloadAction<{
                chatId: string;
                messagePublicId: string;
            }>,
        ) => {
            const { chatId, messagePublicId } = action.payload;
            const chat = state.chats[chatId];

            if (!chat) {
                return state;
            }

            const { messages, unreadMessages } = chat;

            if (unreadMessages) {
                const messageToDelete = unreadMessages.findIndex(message => message.publicId === messagePublicId);

                if (messageToDelete !== -1) {
                    chat.unreadMessages = unreadMessages.filter(message => message.publicId !== messagePublicId);

                    return state;
                }
            }

            if (messages) {
                const messageToDelete = messages.findIndex(({ publicId }) => publicId === messagePublicId);

                if (messageToDelete !== -1) {
                    chat.messages = messages.filter(message => message.publicId !== messagePublicId);
                }
            }
        },
        updateChatInDrawer: (state, action: PayloadAction<{ chatId: string; lastMessage: ChatMessage }>) => {
            const { chatId, lastMessage } = action.payload;

            const chat = state.drawerChats.find(({ publicId }) => publicId === chatId);

            if (chat?.lastMessage) {
                chat.lastMessage = lastMessage;
            }
        },
        setChatMessagesNextCursor: (state, action: PayloadAction<{ chatId: string; isRead: boolean; cursor: string | null }>) => {
            const { chatId, isRead, cursor } = action.payload;
            const chat = state.chats[chatId];

            if (!chat) {
                return state;
            }

            if (isRead) {
                chat.getChatMessagesRequest.nextCursor = cursor;

                return state;
            }

            chat.getChatUnreadMessagesRequest.nextCursor = cursor;
        },
        setChatUnreadMessagesNextCursor: (state, action: PayloadAction<{ chatId: string; cursor: string | null }>) => {
            const { chatId, cursor } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.getChatUnreadMessagesRequest.nextCursor = cursor;
            }
        },
        setSendMessageRequestStatus: (state, action: PayloadAction<{ chatId: string; status: RequestStatus }>) => {
            const { chatId, status } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.sendMessageRequest.status = status;
            }
        },
        setReadMessageRequestStatus: (state, action: PayloadAction<{ chatId: string; status: RequestStatus }>) => {
            const { chatId, status } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.sendMessageRequest.status = status;
            }
        },

        setDeleteMessageRequestStatus: (state, action: PayloadAction<{ chatId: string; status: RequestStatus }>) => {
            const { chatId, status } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.deleteMessageRequest.status = status;
            }
        },
        updateMessage: (state, action: PayloadAction<{ chatId: string; message: ChatMessage }>) => {
            const { chatId, message: updatedMessage } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                const { messages, unreadMessages } = chat;

                if (unreadMessages) {
                    const message = unreadMessages.find(({ publicId }) => publicId === updatedMessage.publicId);

                    if (message) {
                        chat.messages?.push(updatedMessage);
                        chat.unreadMessages = unreadMessages.filter(({ publicId }) => publicId !== updatedMessage.publicId);

                        return state;
                    }
                }

                if (messages) {
                    const message = messages.find(({ publicId }) => publicId === updatedMessage.publicId);

                    if (message) {
                        Object.assign(message, updatedMessage);
                    }
                }
            }
        },
        setDrawerChatUnreadMessagesCount: (state, action: PayloadAction<{ publicId: string; unreadMessageCount: number }>) => {
            const { publicId: chatPublicId, unreadMessageCount } = action.payload;
            const chat = state.drawerChats.find(({ publicId }) => publicId === chatPublicId);

            if (chat) {
                chat.unreadMessageCount = unreadMessageCount;
            }
        },
        makeAllMessagesBeforeRead: (state, action: PayloadAction<{ chatId: string; messagePublicId: string }>) => {
            const { chatId, messagePublicId } = action.payload;
            const chat = state.chats[chatId];

            if (chat && chat.unreadMessages && chat.unreadMessages.length >= 0) {
                const readMessageIndex = chat.unreadMessages.findIndex(({ publicId }) => publicId === messagePublicId);
                const allReadyReadMessages = chat.unreadMessages;

                chat.unreadMessages = allReadyReadMessages.splice(readMessageIndex + 1);
                chat.messages?.push(...allReadyReadMessages);
            }
        },
        setLastReadMessageId: (state, action: PayloadAction<{ chatId: string; messagePublicId: string | null }>) => {
            const { chatId, messagePublicId } = action.payload;
            const chat = state.chats[chatId];

            if (chat && (chat.lastReadMessageId === null || messagePublicId === null)) {
                chat.lastReadMessageId = messagePublicId;
            }
        },
        setDriverSupportChat: (state, action: PayloadAction<ChatShortInfo | null>) => {
            state.driverSupportChat = action.payload;
        },
        setDriverSupportChatLastMessage: (state, action: PayloadAction<ChatMessage>) => {
            const chat = state.driverSupportChat;

            if (chat) {
                state.driverSupportChat = {
                    ...chat,
                    lastMessage: action.payload,
                };
            }
        },
        setDriverSupportChatUnreadMessageCount: (state, action: PayloadAction<number>) => {
            const chat = state.driverSupportChat;

            if (chat) {
                state.driverSupportChat = {
                    ...chat,
                    unreadMessageCount: action.payload,
                };
            }
        },
        setSupportChatDrawerProps: (state, action: PayloadAction<SupportChatDrawerPropsState>) => {
            state.supportChatDrawerProps = action.payload;
        },
    },
});

export const chatsActions = chatsSlice.actions;

export const chatsReducer = chatsSlice.reducer;
