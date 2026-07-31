import React, { ReactNode, RefObject, useMemo, useRef } from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { ChatMessageTypesEnum, ChatTypesEnum } from '@/enums';
import { useMeAdmin } from '@/hooks/use-user-role-group';
import { SystemIcon } from '@icons';
import { useAppSelector } from '@store';
import { chatExternalNumberSelector } from '@store/client';
import { ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { authorizedUserAccountPublicIdSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { ChatMessageOptions } from '../chat-message-options';
import { ChatMessageOrder } from '../chat-message-order';

import MessageTailIcon from './message-tail.svg';

import './chat-message-wrapper.scss';

const cn = classname('chat-message-wrapper');
const notificationCn = classname('notification');
const t = translateByNamespace('common:chats');
const activityT = translateByNamespace('client:order:activity');

type ChatMessageWrapperProps = Pick<ChatMessageType, 'creator' | 'type' | 'createdAt' | 'order' | 'attachments'> & {
    children: ReactNode;
    itemRef: RefObject<HTMLDivElement> | null;
    showOrderDetails?: boolean;
    showMessageOptions?: boolean;
    hasAvatar?: boolean;
    className?: string;
    view: 'light' | 'default';
    chatId: string | null;
    chatType?: ChatTypesEnum | null;
    messagePublicId: string;
    messageContent?: string;
};

export const ChatMessageWrapper = ({
    creator,
    attachments,
    type,
    children,
    createdAt,
    order,
    showOrderDetails = false,
    showMessageOptions = false,
    hasAvatar = false,
    itemRef,
    className,
    view,
    chatId,
    chatType,
    messagePublicId,
    messageContent,
}: ChatMessageWrapperProps) => {
    const isMeAdmin = useMeAdmin();
    const contentRef = useRef<HTMLDivElement>(null);

    const authorizedUserAccountPublicId = useAppSelector(authorizedUserAccountPublicIdSelector);
    const isIncomingMessage = [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.INCOMING_SMS].includes(type);
    const isMine = creator?.accountPublicId === authorizedUserAccountPublicId && !isIncomingMessage;
    const isSupportMessage = chatType === ChatTypesEnum.SUPPORT && !!creator && !isMeAdmin && !isMine;

    const showAvatar = creator && !isIncomingMessage && !isMine && !isSupportMessage;
    const isSystemMessage = !creator && !isIncomingMessage;

    const createdAtTime = useMemo(() => new Date(createdAt).toLocaleTimeString().substring(0, 5), [createdAt]);

    const phone = useAppSelector(chatExternalNumberSelector(chatId));

    const isCallMessage = [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.OUTGOING_CALL].includes(type);

    const creatorName = useMemo(() => {
        if (isSupportMessage) {
            return t('support-chat-header');
        }
        if (creator && !isIncomingMessage && type !== ChatMessageTypesEnum.OUTGOING_CALL && !isMine) {
            return `${creator.name} ${creator.nickname ? ` (${creator.nickname})` : ''}`;
        }

        if (isSystemMessage) {
            return activityT('system-name');
        }

        if (isIncomingMessage && !isCallMessage && phone) {
            return formatInternationalPhoneNumber(phone);
        }

        return null;
    }, [isSupportMessage, creator, isIncomingMessage, type, isMine, isSystemMessage, isCallMessage, phone]);

    return (
        <div className={cn('', { mine: isMine }, [className])} ref={itemRef}>
            {hasAvatar && (
                <>
                    {showAvatar && <Avatar src={isIncomingMessage ? '' : creator?.avatar?.url} />}
                    {isSystemMessage && <SystemIcon className={notificationCn('system-icon')} />}
                </>
            )}
            <Dropdown
                trigger='hover'
                disabled={!showMessageOptions || !isMine}
                renderMenuComponent={isOpen =>
                    showMessageOptions && isMine ? (
                        <ChatMessageOptions
                            isOpen={isOpen}
                            contentRef={contentRef}
                            hideUpdateOption={!!attachments?.length}
                            chatId={chatId}
                            messagePublicId={messagePublicId}
                            messageContent={messageContent}
                        />
                    ) : null
                }
            >
                <div className={cn('content-wrapper')} ref={contentRef}>
                    {creatorName && <span className={cn('support-text')}>{creatorName}</span>}
                    <div className={cn('content', { view })}>
                        {children}
                        <MessageTailIcon className={cn('tail', { view })} />
                    </div>
                    {showOrderDetails && order && <ChatMessageOrder order={order} isMine={isMine} time={createdAtTime} />}
                </div>
            </Dropdown>
        </div>
    );
};
