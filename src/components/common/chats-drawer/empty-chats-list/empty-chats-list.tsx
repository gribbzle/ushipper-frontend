import React, { useCallback } from 'react';

import { useMeAdmin } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { useAppDispatch } from '@store';
import { messagesActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Button } from '../../button';

import './empty-chats-list.scss';

const t = translateByNamespace('common:chats');
const tButton = translateByNamespace('common:messages-page');

const cn = classname('empty-chats-list');

export const EmptyChatsList = ({ isSearch = false }: { isSearch?: boolean }) => {
    const isMeAdmin = useMeAdmin();
    const dispatch = useAppDispatch();

    const handleNewChatClick = useCallback(() => dispatch(messagesActions.setDriverChatSelectorPopupProps({ isPopupOpened: true })), [dispatch]);

    return (
        <div className={cn('')}>
            {isSearch ? (
                <>
                    <span>{t('no-chats-found')}</span>
                    <span>{t('no-chats-found-text')}</span>
                </>
            ) : (
                <span>{t('no-chats-yet')}</span>
            )}
            {isMeAdmin && (
                <>
                    <span>{t('find-driver-text')}</span>
                    <span>{t('add-new-chat-text')}</span>
                    <Button onClick={handleNewChatClick} size='small' view='primary' plain={true} className={cn('button')}>
                        <PlusCircleIcon /> {tButton('new-chat-button')}
                    </Button>
                </>
            )}
        </div>
    );
};
