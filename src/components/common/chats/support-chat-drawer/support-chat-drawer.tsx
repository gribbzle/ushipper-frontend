import React, { useMemo } from 'react';

import { Drawer } from '@/components/common/drawer/drawer';
import { VerifiedIcon } from '@/components/common/verified-icon/verified-icon';
import { useAppSelector } from '@store';
import { chatInfoSelector, selectedChatIdSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { SupportChat } from './support-chat/support-chat';
import { useSupportChatDrawer } from './use-support-chat-drawer';

import './support-chat-drawer.scss';

const t = translateByNamespace('common:chats');
const cn = classname('support-chat-drawer');

export const SupportChatDrawer = () => {
    const { handleClose, isVisible, accountName } = useSupportChatDrawer();
    const chatId = useAppSelector(selectedChatIdSelector);
    const chatInfo = useAppSelector(chatInfoSelector(chatId));

    const header = useMemo(() => {
        const { account } = chatInfo || {};

        return (
            <div className={cn('head')}>
                {account?.name ?? accountName ?? t('driver-label')}
                {account?.phone && (
                    <span className={cn('phone')}>
                        {formatInternationalPhoneNumber(account.phone)} <VerifiedIcon checked={!!account.phoneVerifiedAt} />
                    </span>
                )}
            </div>
        );
    }, [accountName, chatInfo]);

    return <Drawer isOpen={isVisible} onClose={handleClose} head={header} body={<SupportChat />} className={cn()} />;
};
