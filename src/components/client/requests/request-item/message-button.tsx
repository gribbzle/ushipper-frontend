import React, { MouseEvent, useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { useAppDispatch } from '@store';
import { chatsActions, openChatByOrderIdAction } from '@store/common';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:requests-page:drawer:request-item');

type Props = {
    orderId: string;
};

export const MessageButton = ({ orderId }: Props) => {
    const dispatch = useAppDispatch();

    const handleMessageButton = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            dispatch(openChatByOrderIdAction(orderId)).then(() => {
                dispatch(
                    chatsActions.setIsDrawerOpen({
                        isDrawerOpen: true,
                        needToReset: true,
                        setSelectedAtTop: true,
                    }),
                );
            });
        },
        [dispatch, orderId],
    );

    return (
        <Button onClick={handleMessageButton} size='medium'>
            {t('messages-btn')}
        </Button>
    );
};
