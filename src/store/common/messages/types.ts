import { RequestStatus } from '@utils';

export type DriverChatSelectorPopupPropsState = {
    isPopupOpened: boolean;
};

export type DeleteChatMessagePopupPropsState = {
    isPopupOpened: boolean;
    chatId: string | null;
    messagePublicId: string | null;
};

export type UpdateChatMessagePopupPropsState = {
    isPopupOpened: boolean;
    chatId: string | null;
    messagePublicId: string | null;
    content: string | null;
};

export type MessagesSliceState = {
    chatsSearchText: string;
    getSupportChatRequest: {
        status: RequestStatus;
        nextCursor: string | null;
    };
    driverChatSelectorPopupProps: DriverChatSelectorPopupPropsState;
    deleteChatMessagePopupProps: DeleteChatMessagePopupPropsState;
    updateChatMessagePopupProps: UpdateChatMessagePopupPropsState;
};
