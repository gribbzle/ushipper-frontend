import React, { useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { useAppDispatch } from '@store';
import { chatsActions } from '@store/client';
import MessageTextRightIcon from '@/assets/icons/message-text-right.svg';

export const OpenSupportChatButton = ({ name, accountId }: { name: string; accountId?: string | null }) => {
    const dispatch = useAppDispatch();

    const onMessageClickHandler = useCallback(
        async (event: React.MouseEvent) => {
            event.stopPropagation();

            dispatch(
                chatsActions.setSupportChatDrawerProps({
                    isVisible: true,
                    accountId: accountId ?? null,
                    accountName: name,
                }),
            );
        },
        [name, accountId, dispatch],
    );

    return (
        <Button view='default' plain={true} size='mini' onClick={onMessageClickHandler}>
            <MessageTextRightIcon />
        </Button>
    );
};
