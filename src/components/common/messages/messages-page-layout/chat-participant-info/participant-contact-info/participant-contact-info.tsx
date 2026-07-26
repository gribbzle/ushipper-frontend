import React, { useCallback } from 'react';

import { ChatAccountInfo } from '@store/common/chats/types';
import { classname, formatExternalPhoneNumber, translateByNamespace } from '@utils';

import './participant-contact-info.scss';

const cn = classname('participant-contact-info');
const t = translateByNamespace('common:messages-page:chat-participant-info');

export const ParticipantContactInfo = ({ account }: { account: ChatAccountInfo }) => {
    const { name, phone, email } = account;

    const onNameClickHandler = useCallback(
        (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            e.stopPropagation();
            if (name) {
                window.open(`accounting/drivers?name=${encodeURIComponent(name)}`, '_blank');
            }
        },
        [name],
    );

    return (
        <div className={cn('')}>
            <h4 className={cn('title')}>{t('user-details-title')}</h4>
            <div className={cn('item')}>
                <span className={cn('item-value', { primary: !!name })} onClick={e => onNameClickHandler(e)}>
                    {name}
                </span>
                <span className={cn('item-label')}>{t('user-name-label')}</span>
            </div>
            <div className={cn('item')}>
                <span className={cn('item-value')}>{phone ? formatExternalPhoneNumber(phone) : t('no-phone-label')}</span>
                <span className={cn('item-label')}>{t('mobile-label')}</span>
            </div>
            <div className={cn('item')}>
                <span className={cn('item-value')}>{email ?? t('no-email-label')}</span>
                <span className={cn('item-label')}>{t('email-label')}</span>
            </div>
        </div>
    );
};
