import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@store';
import { chatsActions } from '@store/client';
import { ChatShortInfo } from '@store/common/chats/types';
import { getSupportChatAction } from '@store/common/messages/actions';
import { translateByNamespace } from '@utils/i18n';

import { DriverSelectorFormState, DriverSelectorFormStateProps } from './driver-chat-selector-form.types';

const t = translateByNamespace('common:messages-page:notifications');

export const useDriverChatSelectorForm = ({ onAfterSubmit }: Pick<DriverSelectorFormStateProps, 'onAfterSubmit'>) => {
    const dispatch = useAppDispatch();
    const [selectedDriverName, setSelectedDriverName] = useState<string | null>(null);

    const onSubmit = useCallback(
        async ({ driverId }: DriverSelectorFormState) => {
            if (selectedDriverName) {
                const fetchedSupportChatResponse = await dispatch(getSupportChatAction({ name: selectedDriverName, accountId: driverId }));

                if (fetchedSupportChatResponse.meta.requestStatus === 'fulfilled') {
                    const chat = fetchedSupportChatResponse.payload as ChatShortInfo;

                    dispatch(chatsActions.prependDrawersChats({ chat, moveAtTop: true }));
                    dispatch(chatsActions.setSelectedChatId(chat.publicId));

                    onAfterSubmit();
                } else {
                    toast.error<string>(t('choose-driver-chat-selector-error'));
                }
            }
        },
        [dispatch, onAfterSubmit, selectedDriverName],
    );

    return { onSubmit, selectedDriverName, setSelectedDriverName };
};
