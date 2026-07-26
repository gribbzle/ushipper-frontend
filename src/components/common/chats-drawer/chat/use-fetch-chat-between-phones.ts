import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@store';
import { chatsActions, getChatByBetweenPhonesAction } from '@store/client';
import { ChatShortInfo } from '@store/common/chats/types';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:chats');

export const useFetchChatBetweenPhones = ({ internalPhone, externalPhone }: { internalPhone?: string | null; externalPhone?: string | null }) => {
    const dispatch = useAppDispatch();

    const [fetchedChat, setFetchedChat] = useState<ChatShortInfo | null>(null);

    const fetchChatBetweenPhones = useCallback(async (): Promise<ChatShortInfo | null> => {
        if (!internalPhone || !externalPhone) {
            return null;
        }

        try {
            const data = await dispatch(getChatByBetweenPhonesAction({ internalPhone, externalPhone })).unwrap();

            await dispatch(chatsActions.appendDrawersChats([data as ChatShortInfo]));

            setFetchedChat(data);

            return data;
        } catch (error) {
            toast.error<string>(t('send-message-error-notification'));

            return null;
        }
    }, [dispatch, internalPhone, externalPhone]);

    return { fetchedChat, fetchChatBetweenPhones };
};
