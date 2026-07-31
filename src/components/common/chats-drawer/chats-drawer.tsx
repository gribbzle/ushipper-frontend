import React, { useCallback } from 'react';

import { useIsPartnerCompany } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, isChatsDrawerOpenSelector, selectedChatIdSelector } from '@store/common';
import { classname } from '@utils/classname';

import { Drawer } from '../drawer';

import { Chat } from './chat';
import { ChatsHead } from './chats-head';
import { ChatsList } from './chats-list';

import './chats-drawer.scss';

const cn = classname('chats-drawer');

export const ChatsDrawer = () => {
    const dispatch = useAppDispatch();
    const { isDrawerOpen } = useAppSelector(isChatsDrawerOpenSelector);

    const onCloseHandler = useCallback(() => {
        dispatch(
            chatsActions.setIsDrawerOpen({
                isDrawerOpen: false,
                needToReset: false,
            }),
        );
        dispatch(chatsActions.setSelectedChatId(null));
    }, [dispatch]);

    const selectedChatId = useAppSelector(selectedChatIdSelector);
    const isPartner = useIsPartnerCompany();

    return (
        <Drawer
            isOpen={isDrawerOpen}
            onClose={onCloseHandler}
            head={<ChatsHead />}
            actions={null}
            className={cn('', { partner: isPartner })}
            bodyCloseMode='just-hide-on-close'
            body={
                <div className={cn()}>
                    <ChatsList />
                    <Chat chatId={selectedChatId} />
                </div>
            }
        />
    );
};
