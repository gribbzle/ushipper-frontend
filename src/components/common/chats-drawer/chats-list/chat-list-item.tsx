import React, { useCallback, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { useSelector } from 'react-redux';

import { Avatar } from '@/components/common/avatar/avatar';
import { Badge } from '@/components/common/badge/badge';
import { ChatMessageTypesEnum } from '@/enums/chat-message-types-enum';
import { ChatTypesEnum } from '@/enums/chat-types-enum';
import useMessageContent from '@/hooks/chat/use-message-content';
import { SystemIcon } from '@icons';
import { useAppDispatch } from '@store';
import { chatsActions, selectedChatIdSelector } from '@store/common';
import { ChatShortInfo } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { ChatAttachmentsInfo } from './chat-attachments-info';
import { ChatOrderTagsInfo } from './chat-order-tags-info';

const t = translateByNamespace('common:chats');
const paymentMethodsTranslate = translateByNamespace('common:payment-terms');

const chatsListItemCn = classname('chats-list-item');
const notificationCn = classname('notification');
const activityT = translateByNamespace('client:order:activity');

type Props = {
    chat: ChatShortInfo;
};

export const ChatBadge = ({ chat }: Props) => {
    const { publicId, lastMessage, unreadMessageCount } = chat;
    const selectedChatId = useSelector(selectedChatIdSelector);

    if (!lastMessage) {
        return null;
    }

    return (
        <Badge
            badgeContent={unreadMessageCount}
            showZero={false}
            withBorder={true}
            isBadgeContentDanger={true}
            color={selectedChatId === publicId ? 'primary' : undefined}
        >
            {lastMessage.type === ChatMessageTypesEnum.MESSAGE ? (
                lastMessage.creator ? (
                    <Avatar src={lastMessage.creator.avatar?.url} />
                ) : (
                    <SystemIcon className={notificationCn('system-icon')} />
                )
            ) : (
                <Avatar />
            )}
        </Badge>
    );
};

export const ChatListItem = ({ chat }: Props) => {
    const dispatch = useAppDispatch();

    const { publicId, order, lastMessage, type, externalNumber } = chat;
    const paymentInformation = order?.paymentInformation;
    const selectedChatId = useSelector(selectedChatIdSelector);

    const content = useMessageContent({
        creator: lastMessage?.creator || null,
        content: lastMessage?.content || '',
        systemMessageType: lastMessage?.systemMessageType || null,
        systemMessagePayload: lastMessage?.systemMessagePayload,
        externalStatus: lastMessage?.externalStatus,
    });

    const onChatSelectHandler = useCallback(
        (newSelectedChatId: string) => {
            if (selectedChatId !== newSelectedChatId) {
                dispatch(chatsActions.initializeChatState(newSelectedChatId));
                dispatch(chatsActions.setSelectedChatId(newSelectedChatId));
            }
        },
        [dispatch, selectedChatId],
    );

    const orderDetails = useMemo(() => {
        if (type === ChatTypesEnum.BETWEEN_PHONES) {
            return null;
        }

        return (
            <div className={chatsListItemCn('order-details')}>
                <span>
                    {t('chat-list-order-id')}
                    {order?.orderId}
                    {paymentInformation?.payment && (
                        <>
                            &nbsp; ${paymentInformation.payment} ({paymentMethodsTranslate(toKebabCase(paymentInformation.terms))})
                        </>
                    )}
                    <ChatOrderTagsInfo chat={chat} />
                </span>
            </div>
        );
    }, [type, order, paymentInformation?.payment, paymentInformation?.terms, chat]);

    return (
        <div key={publicId} className={chatsListItemCn('', { selected: selectedChatId === publicId })} onClick={() => onChatSelectHandler(publicId)}>
            {orderDetails}
            {lastMessage && (
                <div className={chatsListItemCn('avatar-and-last-message')}>
                    <ChatBadge chat={chat} />
                    <div className={chatsListItemCn('last-message')}>
                        {lastMessage.type !== ChatMessageTypesEnum.MESSAGE && externalNumber && <h4>{formatInternationalPhoneNumber(externalNumber)}</h4>}
                        {lastMessage.type === ChatMessageTypesEnum.MESSAGE && (
                            <h4>{lastMessage.creator ? lastMessage.creator.name : activityT('system-name')}</h4>
                        )}
                        <span>{diffForHumans(new Date(lastMessage.createdAt))}</span>
                        <p>
                            <ChatAttachmentsInfo lastMessage={lastMessage} /> {content}
                        </p>
                    </div>
                </div>
            )}
            {!lastMessage && (
                <div className={chatsListItemCn('avatar-and-last-message')}>
                    <div className={chatsListItemCn('last-message')}>
                        <p>{t('no-messages-placeholder')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
