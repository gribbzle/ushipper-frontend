import React, { useMemo } from 'react';

import { useMeAdmin } from '@hooks';
import { classname, translateByNamespace } from '@utils';

import './support-chat-header.scss';

const cn = classname('support-chat-header');
const t = translateByNamespace('common:chats');

export const SupportChatHeader = ({ accountName }: { accountName?: string }) => {
    const isMeAdmin = useMeAdmin();

    const title = useMemo(() => {
        if (isMeAdmin) {
            return accountName ?? t('driver-label');
        }

        return t('support-chat-header');
    }, [isMeAdmin, accountName]);

    return <h4 className={cn()}>{title}</h4>;
};
