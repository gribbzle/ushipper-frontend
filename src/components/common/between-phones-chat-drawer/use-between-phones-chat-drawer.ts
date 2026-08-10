import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useDebouncedGetChats } from '@/hooks/chat/use-debounced-get-chats';
import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, messagesActions, selectedChatIdSelector } from '@store/client';
import { loadboardActions, loadboardBetweenPhonesChatDrawerStateSelector } from '@store/client/loadboard';
import { cleanPhoneNumber } from '@utils/phone';

export const useBetweenPhonesChatDrawer = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const getChatsDebounced = useDebouncedGetChats();

    const isMessagesPage = router.pathname.includes('messages');
    const { isVisible, externalNumber } = useAppSelector(loadboardBetweenPhonesChatDrawerStateSelector);
    const selectedChatId = useAppSelector(selectedChatIdSelector);

    const handleClose = useCallback(() => {
        if (isMessagesPage) {
            getChatsDebounced();
        }

        dispatch(chatsActions.setSelectedChatId(null));
        dispatch(
            loadboardActions.setBetweenPhonesChatDrawer({
                isVisible: false,
                externalNumber: null,
            }),
        );
    }, [dispatch, isMessagesPage, getChatsDebounced]);

    const onAfterSubmitMessage = useCallback(
        (chatId: string | null) => {
            if (isMessagesPage) {
                if (externalNumber) {
                    dispatch(messagesActions.setChatsSearchText(cleanPhoneNumber(externalNumber)));
                }

                dispatch(chatsActions.setSelectedChatId(chatId));

                dispatch(
                    loadboardActions.setBetweenPhonesChatDrawer({
                        isVisible: false,
                        externalNumber: null,
                    }),
                );
            }
        },
        [dispatch, isMessagesPage, externalNumber],
    );

    return { onAfterSubmitMessage, handleClose, isVisible, externalNumber, selectedChatId };
};
