import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { ChatOrderTagsInfo } from '@/components/common/chats-drawer/chats-list/chat-order-tags-info/chat-order-tags-info';
import { ChatTypesEnum } from '@/enums/chat-types-enum';
import { ChatShortInfo } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './chat-item-order-details.scss';

const t = translateByNamespace('common:chats');
const paymentMethodsTranslate = translateByNamespace('common:payment-terms');

const cn = classname('chat-item-order-details');

export const ChatItemOrderDetails = ({ chat, showPaymentInformation = true }: { chat: ChatShortInfo; showPaymentInformation?: boolean }) => {
    const { order, type } = chat;
    const paymentInformation = order?.paymentInformation;

    if (type === ChatTypesEnum.BETWEEN_PHONES) {
        return null;
    }

    return (
        <div className={cn('')}>
            <div className={cn('row')}>
                <span className={cn('order')}>
                    {t('chat-list-order-id')} {order?.orderId}
                </span>
                <ChatOrderTagsInfo chat={chat} context='page' />
            </div>
            {showPaymentInformation && !!paymentInformation?.payment && (
                <span className={cn('row', [cn('details')])}>
                    ${paymentInformation.payment} {!!paymentInformation.terms && `(${paymentMethodsTranslate(toKebabCase(paymentInformation.terms))})`}
                </span>
            )}
        </div>
    );
};
