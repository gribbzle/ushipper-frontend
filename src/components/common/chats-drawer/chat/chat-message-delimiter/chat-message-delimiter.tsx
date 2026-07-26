import React from 'react';

import { classname, translateByNamespace } from '@utils';

import './chat-message-delimiter.scss';

const cn = classname('chat-message-delimiter');
const t = translateByNamespace('common:chats');

export const ChatMessageDelimiter = ({ date }: { date: string }) => (
    <div className={cn('')}>
        <span>{date}</span>
    </div>
);

export const ChatUnreadMessageDelimiter = () => (
    <div className={cn('', { 'new-messages': true })}>
        <span>{t('new-messages-label')}</span>
    </div>
);
