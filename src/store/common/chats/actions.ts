import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ChatTypesEnum } from '@/enums';
import {
    createBetweenPhonesChat,
    deleteMessage,
    fetchChat,
    fetchChatIdByJobOfferId,
    fetchChatIdByOrderId,
    fetchChatIdByOrderOfferId,
    fetchChatMessages,
    fetchChats,
    readMessage,
    sendMessage,
    updateMessage,
} from '@api';
import { AppState } from '@store';
import { cleanPhoneNumber, RequestStatus } from '@utils';

import { translateByNamespace } from '../../../utils/i18n';

import {
    chatMessagesNextCursorSelector,
    chatMessagesRequestSelector,
    chatMessagesSelector,
    chatsNextCursorSelector,
    chatUnreadMessagesRequestSelector,
    chatUnreadMessagesSelector,
    drawerChatsSelector,
    lastReadMessageIdSelector,
    selectedChatIdSelector,
} from './selectors';
import { chatsActions } from './slice';
import { ChatShortInfo } from './types';

const t = translateByNamespace('common:chats');

export const getChatsAction = createAsyncThunk<ChatShortInfo[], { searchText?: string; isNeedReset?: boolean; type?: ChatTypesEnum }>(
    'chatsDrawer/getChats',
    async (params, { rejectWithValue, dispatch, getState }) => {
        try {
            dispatch(chatsActions.setGetChatsRequestStatus(RequestStatus.PROCESSING));
            const { searchText, isNeedReset, type } = params;

            const state = getState() as AppState;
            const nextCursor = isNeedReset ? null : chatsNextCursorSelector(state);
            const result = await fetchChats(searchText || '', nextCursor, type);

            dispatch(chatsActions.setGetChatsRequestStatus(RequestStatus.SUCCESS));

            if (isNeedReset) {
                dispatch(chatsActions.setDrawersChats(result.data));
            } else {
                dispatch(chatsActions.appendDrawersChats(result.data));
            }

            dispatch(chatsActions.setChatsNextCursor(result.meta.nextCursor));

            return result.data;
        } catch (error) {
            dispatch(chatsActions.setGetChatsRequestStatus(RequestStatus.ERROR));

            return rejectWithValue(error);
        }
    },
);

export const getChatInfoAction = createAsyncThunk<ChatShortInfo, string>('chatsDrawer/getChatInfo', async (chatId, { rejectWithValue, dispatch }) => {
    try {
        dispatch(chatsActions.setGetChatRequestStatus({ chatId, status: RequestStatus.PROCESSING }));
        const result = await fetchChat(chatId);

        dispatch(chatsActions.setGetChatRequestStatus({ chatId, status: RequestStatus.SUCCESS }));
        dispatch(chatsActions.setChatInfo({ chatId, info: result }));

        return result;
    } catch (error) {
        dispatch(chatsActions.setGetChatRequestStatus({ chatId, status: RequestStatus.ERROR }));

        return rejectWithValue(error);
    }
});

export const getChatMessagesAction = createAsyncThunk<void, { chatId: string; isRead: boolean }>(
    'chatsDrawer/getChatMessages',
    async ({ chatId, isRead }, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const getRequestStatus = (isRead ? chatMessagesRequestSelector : chatUnreadMessagesRequestSelector)(chatId)(state);

            if (getRequestStatus?.status === RequestStatus.PROCESSING) {
                return;
            }

            dispatch(chatsActions.setChatMessagesRequestStatus({ chatId, isRead, status: RequestStatus.PROCESSING }));

            const nextCursor = chatMessagesNextCursorSelector(chatId, isRead)(state);
            const result = await fetchChatMessages(chatId, isRead, nextCursor);

            const lastReadMessageId = lastReadMessageIdSelector(chatId)(state);
            const messages = chatMessagesSelector(chatId)(state);
            const unreadMessages = chatUnreadMessagesSelector(chatId)(state);

            if (nextCursor === null && lastReadMessageId === null) {
                if (isRead) {
                    if (unreadMessages && unreadMessages.length > 0) {
                        if (result.data && result.data.length > 0) {
                            dispatch(chatsActions.setLastReadMessageId({ chatId, messagePublicId: result.data[result.data.length - 1]?.publicId }));
                        } else {
                            dispatch(chatsActions.setLastReadMessageId({ chatId, messagePublicId: unreadMessages[0]?.publicId }));
                        }
                    }
                } else {
                    if (result.data && result.data.length > 0) {
                        if (messages && messages.length > 0) {
                            dispatch(chatsActions.setLastReadMessageId({ chatId, messagePublicId: messages[messages.length - 1]?.publicId }));
                        } else {
                            dispatch(chatsActions.setLastReadMessageId({ chatId, messagePublicId: result.data[0]?.publicId }));
                        }
                    }
                }
            }

            dispatch(chatsActions.setChatMessagesRequestStatus({ chatId, isRead, status: RequestStatus.SUCCESS }));
            dispatch(chatsActions.appendMessagesToChat({ chatId, isRead, messages: result.data, insertToEnd: !isRead }));
            dispatch(chatsActions.setChatMessagesNextCursor({ chatId, isRead, cursor: result.meta.nextCursor }));
        } catch (error) {
            dispatch(chatsActions.setChatMessagesRequestStatus({ chatId, isRead, status: RequestStatus.ERROR }));

            return rejectWithValue(error);
        }
    },
);

export const sendMessageAction = createAsyncThunk<void, { chatId: string; content?: string; files?: FileList; type?: 'outgoing_sms' | null }>(
    'chatsDrawer/sendMessageAction',
    async ({ chatId, content, files, type }, { rejectWithValue, dispatch, getState }) => {
        try {
            dispatch(chatsActions.setSendMessageRequestStatus({ chatId, status: RequestStatus.PROCESSING }));
            const state = getState() as AppState;

            const result = await sendMessage(chatId, content, files, type);

            const drawerChats = state.common.chats.drawerChats;

            dispatch(chatsActions.setSendMessageRequestStatus({ chatId, status: RequestStatus.SUCCESS }));
            dispatch(
                chatsActions.appendMessagesToChat({
                    chatId,
                    isRead: true,
                    messages: [result],
                    insertToEnd: true,
                    insertFromWebsocket: true,
                }),
            );
            dispatch(
                chatsActions.setDrawersChats(
                    drawerChats.map(drawerChat => {
                        if (drawerChat.publicId === chatId) {
                            return {
                                ...drawerChat,
                                lastMessage: result,
                            };
                        }

                        return drawerChat;
                    }),
                ),
            );
        } catch (error) {
            dispatch(chatsActions.setSendMessageRequestStatus({ chatId, status: RequestStatus.ERROR }));

            toast.error(t<string>('send-message-error'));

            return rejectWithValue(error);
        }
    },
);

export const updateMessageAction = createAsyncThunk<void, { chatId: string; content: string; messagePublicId: string }>(
    'chatsDrawer/updateMessageAction',
    async ({ chatId, content, messagePublicId }, { rejectWithValue, dispatch, getState }) => {
        try {
            dispatch(chatsActions.setSendMessageRequestStatus({ chatId, status: RequestStatus.PROCESSING }));

            const result = await updateMessage({ chatId, messagePublicId, content });
            const state = getState() as AppState;
            const drawerChats = state.common.chats.drawerChats;

            dispatch(chatsActions.setSendMessageRequestStatus({ chatId, status: RequestStatus.SUCCESS }));
            dispatch(chatsActions.updateMessage({ chatId: chatId, message: result }));
            dispatch(
                chatsActions.setDrawersChats(
                    drawerChats.map(drawerChat => {
                        if (drawerChat.publicId === chatId && drawerChat.lastMessage?.publicId === messagePublicId) {
                            return {
                                ...drawerChat,
                                lastMessage: result,
                            };
                        }

                        return drawerChat;
                    }),
                ),
            );
        } catch (error) {
            dispatch(chatsActions.setSendMessageRequestStatus({ chatId, status: RequestStatus.ERROR }));

            toast.error(t<string>('update-message-error'));

            return rejectWithValue(error);
        }
    },
);

export const readMessageAction = createAsyncThunk<void, { chatId: string; messagePublicId: string }>(
    'chatsDrawer/readMessageAction',
    async ({ chatId, messagePublicId }, { rejectWithValue, dispatch }) => {
        try {
            dispatch(chatsActions.setReadMessageRequestStatus({ chatId, status: RequestStatus.PROCESSING }));
            await readMessage(chatId, messagePublicId);

            dispatch(chatsActions.makeAllMessagesBeforeRead({ chatId, messagePublicId }));
            dispatch(chatsActions.setReadMessageRequestStatus({ chatId, status: RequestStatus.SUCCESS }));
        } catch (error) {
            dispatch(chatsActions.setReadMessageRequestStatus({ chatId, status: RequestStatus.ERROR }));

            return rejectWithValue(error);
        }
    },
);

export const deleteMessageAction = createAsyncThunk<any, { chatId: string; messagePublicId: string }>(
    'chatsDrawer/deleteMessageAction',
    async ({ chatId, messagePublicId }: { chatId: string; messagePublicId: string }, { rejectWithValue, dispatch }) => {
        try {
            dispatch(chatsActions.setDeleteMessageRequestStatus({ chatId, status: RequestStatus.PROCESSING }));

            await deleteMessage({ chatId, messagePublicId });

            dispatch(chatsActions.deleteMessageFromChat({ chatId, messagePublicId }));
            dispatch(chatsActions.setDeleteMessageRequestStatus({ chatId, status: RequestStatus.SUCCESS }));

            toast.success(t<string>('delete-message-success'));
        } catch (error) {
            dispatch(chatsActions.setDeleteMessageRequestStatus({ chatId, status: RequestStatus.ERROR }));

            toast.error(t<string>('delete-message-error'));

            return rejectWithValue(error);
        }
    },
);

export const getChatIdByOrderIdAction = createAsyncThunk<string, string>('chatsDrawer/getChatIdByOrderId', async (orderId, { rejectWithValue, dispatch }) => {
    try {
        dispatch(chatsActions.setGetChatIdByOrderIdRequests(RequestStatus.PROCESSING));

        const result = await fetchChatIdByOrderId(orderId);

        dispatch(chatsActions.setGetChatIdByOrderIdRequests(RequestStatus.SUCCESS));

        return result.publicId as string;
    } catch (error) {
        dispatch(chatsActions.setGetChatIdByOrderIdRequests(RequestStatus.ERROR));

        return rejectWithValue(error);
    }
});

export const getChatByBetweenPhonesAction = createAsyncThunk<ChatShortInfo, { internalPhone: string; externalPhone: string }>(
    'chatsDrawer/getChatByBetweenPhonesAction',
    async ({ internalPhone, externalPhone }) => {
        return await createBetweenPhonesChat(internalPhone, externalPhone);
    },
);

export const getChatIdByOrderOfferIdAction = createAsyncThunk<string, string>('chatsDrawer/getChatIdByOrderOfferIdAction', async offerId => {
    return await fetchChatIdByOrderOfferId(offerId);
});

export const getChatIdByJobOfferIdAction = createAsyncThunk<string, string>('chatsDrawer/getChatIdByJobOfferIdAction', async jobOfferId => {
    return await fetchChatIdByJobOfferId(jobOfferId);
});

export const openChatByChatId = createAsyncThunk<
    string | null,
    {
        chatId: string;
        needToAppend: boolean;
    }
>('chatsDrawer/openChatByChatId', async (meta, { dispatch, getState }) => {
    const state = getState() as AppState;
    const chatId = meta.chatId;

    if (meta.needToAppend) {
        const fetchChatInfoResponse = await dispatch(getChatInfoAction(chatId));

        if (fetchChatInfoResponse.meta.requestStatus === 'fulfilled') {
            dispatch(chatsActions.appendDrawersChats([fetchChatInfoResponse.payload as ChatShortInfo]));
        }
    }

    const selectedChatId = selectedChatIdSelector(state);

    if (selectedChatId === chatId) {
        return selectedChatId;
    } else {
        dispatch(chatsActions.initializeChatState(chatId));
        dispatch(chatsActions.setSelectedChatId(chatId));

        return chatId;
    }
});
export const openChatByOrderOfferIdAction = createAsyncThunk<string | null, string>(
    'chatsDrawer/getChatIdByOrderOfferId',
    async (offerPublicId, { dispatch, getState }) => {
        const state = getState() as AppState;
        const drawerChats = drawerChatsSelector(state);

        const fetchChatIdResponse = await dispatch(getChatIdByOrderOfferIdAction(offerPublicId));
        const offerChatId = fetchChatIdResponse.payload as string;

        const chat = drawerChats.find(({ publicId }) => publicId === offerChatId);

        const needToAppend = !chat;

        const chatIdAction = await dispatch(
            openChatByChatId({
                chatId: offerChatId,
                needToAppend,
            }),
        );

        return chatIdAction.payload as string;
    },
);

export const openChatByJobOfferIdAction = createAsyncThunk<string | null, string>(
    'chatsDrawer/getChatIdByJobOfferId',
    async (jobOfferPublicId, { dispatch, getState }) => {
        const state = getState() as AppState;
        const drawerChats = drawerChatsSelector(state);

        const fetchChatIdResponse = await dispatch(getChatIdByJobOfferIdAction(jobOfferPublicId));
        const jobOfferChatId = fetchChatIdResponse.payload as string;

        const chat = drawerChats.find(({ publicId }) => publicId === jobOfferPublicId);

        const needToAppend = !chat;

        const chatIdAction = await dispatch(
            openChatByChatId({
                chatId: jobOfferChatId,
                needToAppend,
            }),
        );

        return chatIdAction.payload as string;
    },
);

export const openChatByOrderIdAction = createAsyncThunk<string | null, string>(
    'chatsDrawer/getChatIdByOrderId',
    async (orderPublicId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const drawerChats = drawerChatsSelector(state);
            let newSelectedChatId;

            const chat = drawerChats.find(({ order }) => order?.orderId === orderPublicId);

            newSelectedChatId = chat?.publicId || null;

            if (newSelectedChatId) {
                const chatIdAction = await dispatch(
                    openChatByChatId({
                        chatId: newSelectedChatId,
                        needToAppend: false,
                    }),
                );

                return chatIdAction.payload as string;
            } else {
                const fetchChatIdResponse = await dispatch(getChatIdByOrderIdAction(orderPublicId));

                if (fetchChatIdResponse.meta.requestStatus === 'fulfilled') {
                    newSelectedChatId = fetchChatIdResponse.payload as string;
                    const chatIdAction = await dispatch(
                        openChatByChatId({
                            chatId: newSelectedChatId,
                            needToAppend: true,
                        }),
                    );

                    return chatIdAction.payload as string;
                } else {
                    return null;
                }
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const openChatByPhoneAction = createAsyncThunk<string | null, string>('chatsDrawer/getChats', async (phone, { rejectWithValue, dispatch }) => {
    try {
        const cleanedPhone = cleanPhoneNumber(phone);
        const fetchChatsResponse = await dispatch(getChatsAction({ searchText: cleanedPhone, isNeedReset: !!cleanedPhone }));

        const payload = fetchChatsResponse.payload as ChatShortInfo[];

        if (!!cleanedPhone && payload.length > 0) {
            const firstChat = payload[0];
            let chatId = null;

            if (firstChat) {
                chatId = firstChat.publicId;
            }

            dispatch(chatsActions.setSelectedChatId(chatId));

            return chatId;
        }

        return null;
    } catch (error) {
        return rejectWithValue(error);
    }
});
