import React from 'react';

import { classname, translateByNamespace } from '@utils';

import './chat-empty-block.scss';

const t = translateByNamespace('common:chats');

const cn = classname('chat-empty-block');

export const ChatEmptyBlock = () => <div className={cn('')}>{t('no-messages-placeholder')}</div>;
