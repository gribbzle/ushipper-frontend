import { AppState } from "@store";

export const messagesSelector = (state: AppState) => state.common.messages;

export const chatsSearchTextSelector = (state: AppState) => {
    const { chatsSearchText } = messagesSelector(state);

    return chatsSearchText;
};

export const getSupportChatRequestSelector = (state: AppState) => {
    const { getSupportChatRequest } = messagesSelector(state);

    return getSupportChatRequest;
};

export const driverChatSelectorPopupPropsSelector = (state: AppState) => {
    const { driverChatSelectorPopupProps } = messagesSelector(state);

    return driverChatSelectorPopupProps;
};

export const deleteChatMessagePopupPropsSelector = (state: AppState) => {
    const { deleteChatMessagePopupProps } = messagesSelector(state);

    return deleteChatMessagePopupProps;
};

export const updateChatMessagePopupPropsSelector = (state: AppState) => {
    const { updateChatMessagePopupProps } = messagesSelector(state);

    return updateChatMessagePopupProps;
};
