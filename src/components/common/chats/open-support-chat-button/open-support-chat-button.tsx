import React, { useCallback } from 'react';

import { Button } from '@/components/common';
import { MessageTextRightIcon } from '@icons';
import { useAppDispatch } from '@store';
import { chatsActions } from '@store/client';

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
