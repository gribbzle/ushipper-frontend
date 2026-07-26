import { ChatTypesEnum } from '@/enums';
import { ChatMessage, ChatShortInfo } from '@store/common/chats/types';
import { axios, CursorPagination } from '@utils';

export const fetchChats = async (query: string | null, cursor: string | null, type?: ChatTypesEnum) => {
    const result = await axios.get('/api/chats', { params: { query, cursor, type } });

    return result.data.data as CursorPagination<ChatShortInfo[]>;
};

export const fetchChat = async (chatId: string | null) => {
    const result = await axios.get(`/api/chats/${chatId}`);

    return result.data.data as ChatShortInfo;
};

export const fetchChatIdByOrderId = async (orderId: string | null) => {
    const result = await axios.get(`/api/orders/${orderId}/chats`, { params: { chatType: ChatTypesEnum.BETWEEN_SHIPPER_AND_CARRIER } });

    return result.data.data;
};

export const fetchChatIdByOrderOfferId = async (offerId: string | null): Promise<string> => {
    const result = await axios.get<{ data: { publicId: string } }>(`/api/order-offers/${offerId}/chats`, {
        params: { chatType: ChatTypesEnum.BETWEEN_SHIPPER_AND_CARRIER },
    });

    return result.data.data.publicId;
};

export const fetchChatIdByJobOfferId = async (jobOfferId: string | null): Promise<string> => {
    const result = await axios.get<{ data: { publicId: string } }>(`/api/job-offers/${jobOfferId}/chats`, {
        params: { chatType: ChatTypesEnum.BETWEEN_COMPANY_AND_USER },
    });

    return result.data.data.publicId;
};

export const fetchChatMessages = async (chatId: string | null, isRead: boolean, cursor: string | null) => {
    const result = await axios.get(`/api/chats/${chatId}/messages`, { params: { cursor, isRead, perPage: 20 } });

    return result.data.data as CursorPagination<ChatMessage[]>;
};

export const sendMessage = async (chatId: string | null, content?: string, files?: FileList, type?: 'outgoing_sms' | null) => {
    const data = new FormData();

    if (content) {
        data.append('content', content);
    }

    if (type) {
        data.append('type', type);
    }

    if (files) {
        Array.from(files).forEach(file => data.append('files[]', file));
    }

    const result = await axios({
        url: `/api/chats/${chatId}/messages`,
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result.data.data as ChatMessage;
};

export const readMessage = async (chatId: string, lastReadMessagePublicId: string) => {
    await axios.post(`/api/chats/${chatId}/messages/read`, { lastReadMessagePublicId });
};

export const updateMessage = async ({ chatId, messagePublicId, content }: { chatId: string; messagePublicId: string; content: string }) => {
    const data = new FormData();

    data.append('content', content);

    const result = await axios({
        url: `/api/chats/${chatId}/messages/${messagePublicId}`,
        method: 'PATCH',
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result.data.data as ChatMessage;
};

export const deleteMessage = async ({ chatId, messagePublicId }: { chatId: string; messagePublicId: string }) => {
    const result = await axios.delete(`/api/chats/${chatId}/messages/${messagePublicId}`);

    return result.data;
};

export const createBetweenPhonesChat = async (internalPhone: string, externalPhone: string): Promise<ChatShortInfo> => {
    const result = await axios.post('/api/chats', { type: ChatTypesEnum.BETWEEN_PHONES, internalPhone, externalPhone });

    return result.data.data as ChatShortInfo;
};

export const createSupportChat = async (accountId?: string): Promise<ChatShortInfo> => {
    const payload = {
        type: ChatTypesEnum.SUPPORT,
        ...(accountId && { accountId }),
    };

    const result = await axios.post('/api/chats', payload);

    return result.data.data as ChatShortInfo;
};
