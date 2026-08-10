import React, { useCallback, useState } from 'react';

import { ChoosePhonePopup } from '@/components/client/loadboard/choose-phone-popup/choose-phone-popup';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { useMeAdmin, useMeCarrier } from '@/hooks/use-user-role-group';
import { useMeCarrierDriver } from '@/hooks/use-user-role-type';
import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions } from '@store/client';
import { messagesActions } from '@store/common/messages';
import { authorizedUserTwilioPhoneSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { Button } from '../../button';

import './messages-page-head.scss';
import CallIcon from '@/assets/icons/call-icon.svg';
import MessageTextLeftIcon from '@/assets/icons/message-text-left.svg';
import MessageTextRightIcon from '@/assets/icons/message-text-right.svg';

const t = translateByNamespace('common:messages-page');

const cn = classname('messages-page-head');

export const MessagesPageHead = () => {
    const dispatch = useAppDispatch();
    const isPartner = useIsPartnerCompany();
    const isMeCarrier = useMeCarrier();
    const isMeCarrierDriver = useMeCarrierDriver();
    const isMeAdmin = useMeAdmin();
    const authorizedUserTwilioPhone = useAppSelector(authorizedUserTwilioPhoneSelector);

    const [isChoosePhonePopupOpened, setIsChoosePhonePopupOpened] = useState<boolean>(false);
    const [isChoosePhoneMessagePopupOpened, setIsChoosePhoneMessagePopupOpened] = useState<boolean>(false);

    const handleCallClick = useCallback(() => setIsChoosePhonePopupOpened(true), []);

    const handleMessageClick = useCallback(() => {
        dispatch(chatsActions.setSelectedChatId(null));
        setIsChoosePhoneMessagePopupOpened(true);
    }, [dispatch]);

    const handleNewChatClick = useCallback(() => dispatch(messagesActions.setDriverChatSelectorPopupProps({ isPopupOpened: true })), [dispatch]);

    const renderCallBlock = () => (
        <div className={cn('icon')} onClick={handleCallClick}>
            <CallIcon />
            {isChoosePhonePopupOpened && (
                <ChoosePhonePopup type='call' context='messages-page' onClose={() => setIsChoosePhonePopupOpened(false)} loadBoardFilters={{}} />
            )}
        </div>
    );

    const renderMessageBlock = () => (
        <div className={cn('icon')} onClick={handleMessageClick}>
            <MessageTextRightIcon />
            {isChoosePhoneMessagePopupOpened && (
                <ChoosePhonePopup type='message' context='messages-page' onClose={() => setIsChoosePhoneMessagePopupOpened(false)} loadBoardFilters={{}} />
            )}
        </div>
    );

    return (
        <div className={cn('')}>
            <div className={cn('title', { admin: isMeAdmin })}>
                {t('title')}
                {authorizedUserTwilioPhone && (
                    <span className={cn('twilio-phone', { admin: isMeAdmin })}>{formatInternationalPhoneNumber(authorizedUserTwilioPhone)}</span>
                )}
            </div>

            {isPartner && isMeCarrier && !isMeCarrierDriver && authorizedUserTwilioPhone && (
                <div className={cn('actions', { carrier: true })}>
                    {renderCallBlock()}
                    {renderMessageBlock()}
                </div>
            )}
            {isMeAdmin && (
                <div className={cn('actions', { admin: true })}>
                    <Button onClick={handleNewChatClick} size='small' view='primary' plain={true}>
                        <MessageTextLeftIcon /> {t('new-chat-button')}
                    </Button>

                    {renderCallBlock()}
                    {renderMessageBlock()}
                </div>
            )}
        </div>
    );
};
