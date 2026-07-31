import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Avatar } from '@/components/common/avatar/avatar';
import { Badge } from '@/components/common/badge/badge';
import { ChatMessageTypesEnum, ChatTypesEnum } from '@/enums';
import { useMeAdmin } from '@hooks';
import { DefaultOrderIcon, DefaultPhoneIcon, SystemIcon } from '@icons';
import { selectedChatIdSelector } from '@store/common';
import { ChatShortInfo } from '@store/common/chats/types';
import { classname } from '@utils/classname';

import './chat-item-badge.scss';

const cn = classname('chat-item-badge');

export const ChatItemBadge = ({ chat }: { chat: ChatShortInfo }) => {
    const { publicId, lastMessage, type, user } = chat;
    const selectedChatId = useSelector(selectedChatIdSelector);
    const isMeAdmin = useMeAdmin();

    const defaultBadgeIcon = useMemo(() => {
        if (type === ChatTypesEnum.BETWEEN_SHIPPER_AND_CARRIER) {
            return <DefaultOrderIcon className={cn('system-icon')} />;
        }

        if (type === ChatTypesEnum.BETWEEN_PHONES) {
            return <DefaultPhoneIcon className={cn('system-icon')} />;
        }

        return <Avatar useBlueDefaultIcon={true} size='medium' />;
    }, [type]);

    const lastMessageIcon = useMemo(() => {
        if (lastMessage?.type !== ChatMessageTypesEnum.MESSAGE) {
            if (type === ChatTypesEnum.BETWEEN_PHONES) {
                return <DefaultPhoneIcon className={cn('system-icon')} />;
            }

            return <Avatar useBlueDefaultIcon={true} size='medium' />;
        }

        if (lastMessage?.creator) {
            if (type === ChatTypesEnum.BETWEEN_SHIPPER_AND_CARRIER) {
                return <DefaultOrderIcon className={cn('system-icon')} />;
            }

            return <Avatar src={lastMessage?.creator.avatar?.url} size='medium' useBlueDefaultIcon={true} />;
        }

        return <SystemIcon className={cn('system-icon')} />;
    }, [type, lastMessage?.creator, lastMessage?.type]);

    if (type === ChatTypesEnum.SUPPORT) {
        return (
            <Badge showZero={false} withBorder={true} isBadgeContentDanger={true} color={selectedChatId === publicId ? 'primary' : undefined}>
                {isMeAdmin ? <Avatar src={user?.avatar?.url} size='medium' useBlueDefaultIcon={true} /> : <SystemIcon className={cn('system-icon')} />}
            </Badge>
        );
    }

    return (
        <Badge showZero={false} withBorder={true} isBadgeContentDanger={true} color={selectedChatId === publicId ? 'primary' : undefined}>
            {lastMessage ? lastMessageIcon : defaultBadgeIcon}
        </Badge>
    );
};
