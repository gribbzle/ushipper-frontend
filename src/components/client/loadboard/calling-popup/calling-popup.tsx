import React, { useEffect } from 'react';
import Draggable from 'react-draggable';

import { GenericButton } from '@/components/common/generic-button/generic-button';
import { Loader } from '@/components/common/loader/loader';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { ChatsIcon, EndCallIcon, KeyboardIcon, MicrophoneDisabledIcon, MicrophoneIcon, UserCircle } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { formatPhoneNumber } from '../choose-phone-popup/format-phone-number';
import { useTwilioCall } from '../loadboard-item';

import { CallingKeyboard } from './calling-keyboard';
import { useCallingPopup } from './use-calling-popup';

import './calling-popup.scss';

const cn = classname('calling-popup');
const t = translateByNamespace('client:loadboard:calling');

export const CallingPopup = () => {
    const {
        name,
        call,
        isMuted,
        isOpened,
        phoneNumber,
        orderPublicId,
        loadBoardFilters,
        isKeyboardVisible,
        hideCallingPopup,
        handleMute,
        handleClose,
        handleKeyboardInput,
        setIsKeyboardVisible,
        handleOpenOrderChatDrawer,
    } = useCallingPopup();

    const { formattedDuration, handleCall } = useTwilioCall(loadBoardFilters);

    useEffect(() => {
        if (isOpened) {
            if (phoneNumber && !orderPublicId) {
                handleCall(phoneNumber, null, call);
            } else if (phoneNumber && orderPublicId && !call) {
                handleCall(phoneNumber, orderPublicId, null);
            }
        }
    }, [call, handleCall, isOpened, orderPublicId, phoneNumber]);

    if (hideCallingPopup) {
        return null;
    }

    return (
        <Draggable>
            <Paper
                theme='dark'
                className={cn('')}
                body={
                    <div className={cn('wrapper')}>
                        <div className={cn('calling')}>
                            <div>
                                {name && <div className={cn('title')}>{name}</div>}
                                <div className={cn('content')}>
                                    {formattedDuration ? (
                                        <div className={cn('phone')}>
                                            <UserCircle />
                                            {formatPhoneNumber(phoneNumber)}
                                        </div>
                                    ) : (
                                        <div className={cn('phone')}>
                                            {t('title', { phoneNumber: formatPhoneNumber(phoneNumber) })}
                                            <Loader />
                                        </div>
                                    )}
                                    {formattedDuration && <div>{formattedDuration}</div>}
                                </div>
                            </div>
                            <div className={cn('actions')}>
                                <GenericButton view={isMuted ? 'danger' : 'accent'} onClick={handleMute}>
                                    {isMuted ? <MicrophoneDisabledIcon /> : <MicrophoneIcon />}
                                </GenericButton>
                                <GenericButton onClick={handleOpenOrderChatDrawer}>
                                    <ChatsIcon />
                                </GenericButton>
                                <GenericButton onClick={() => setIsKeyboardVisible(isVisible => !isVisible)}>
                                    <KeyboardIcon />
                                </GenericButton>
                                <GenericButton view='danger' onClick={() => handleClose(call)}>
                                    <EndCallIcon />
                                </GenericButton>
                            </div>
                        </div>
                        {isKeyboardVisible && <CallingKeyboard onInputKey={handleKeyboardInput} onClose={() => setIsKeyboardVisible(false)} />}
                    </div>
                }
            />
        </Draggable>
    );
};
