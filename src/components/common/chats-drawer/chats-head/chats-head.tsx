import React, { useCallback, useState } from 'react';

import { ChoosePhonePopup } from '@/components/client/loadboard/choose-phone-popup/choose-phone-popup';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions } from '@store/client';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { Avatar } from '../../avatar';

import './chats-head.scss';
import CallIcon from '@/assets/icons/call-icon.svg';
import MessageTextRightIcon from '@/assets/icons/message-text-right.svg';

const t = translateByNamespace('common:chats');

const cn = classname('chats-head');

export const ChatsHead = () => {
    const dispatch = useAppDispatch();
    const isPartner = useIsPartnerCompany();
    const authorizedUser = useAppSelector(authorizedUserSelector);
    const { name, nickname, avatar, twilioPhone } = authorizedUser || {};

    const [isChoosePhonePopupOpened, setIsChoosePhonePopupOpened] = useState<boolean>(false);
    const [isChoosePhoneMessagePopupOpened, setIsChoosePhoneMessagePopupOpened] = useState<boolean>(false);

    const handleCallClick = useCallback(() => setIsChoosePhonePopupOpened(true), []);

    const handleMessageClick = useCallback(() => {
        dispatch(chatsActions.setSelectedChatId(null));
        setIsChoosePhoneMessagePopupOpened(true);
    }, [dispatch]);

    return isPartner ? (
        <div className={cn('')}>
            <div className={cn('wrapper')}>
                <Avatar src={avatar?.url} size='mini' />

                <div className={cn('user')}>
                    <span className={cn('user-name')}>
                        {name}
                        {nickname && ` (${nickname})`}
                    </span>
                    {twilioPhone && <span className={cn('user-phone')}>{formatInternationalPhoneNumber(twilioPhone)}</span>}
                </div>
            </div>
            <div className={cn('icon')} onClick={handleCallClick}>
                <CallIcon />
                {isChoosePhonePopupOpened && <ChoosePhonePopup type='call' onClose={() => setIsChoosePhonePopupOpened(false)} loadBoardFilters={{}} />}
            </div>
            <div className={cn('icon')} onClick={handleMessageClick}>
                <MessageTextRightIcon />
                {isChoosePhoneMessagePopupOpened && (
                    <ChoosePhonePopup type='message' onClose={() => setIsChoosePhoneMessagePopupOpened(false)} loadBoardFilters={{}} />
                )}
            </div>
        </div>
    ) : (
        <>{t('chats-drawer-title')}</>
    );
};
