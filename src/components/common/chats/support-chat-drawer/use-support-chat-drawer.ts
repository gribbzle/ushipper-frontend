import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, supportChatDrawerPropsSelector } from '@store/client';

export const useSupportChatDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, accountName } = useAppSelector(supportChatDrawerPropsSelector);

    const handleClose = useCallback(() => {
        dispatch(
            chatsActions.setSupportChatDrawerProps({
                isVisible: false,
                accountId: null,
                accountName: null,
            }),
        );
        dispatch(chatsActions.setSelectedChatId(null));
    }, [dispatch]);

    return { handleClose, isVisible, accountName };
};
