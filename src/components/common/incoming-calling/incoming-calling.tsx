import React from 'react';
import Draggable from 'react-draggable';

import { formatPhoneNumber } from '@/components/client/loadboard/choose-phone-popup/format-phone-number';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import callingMP3 from '../../../../public/calling.mp3';
import { Button } from '../button';
import { GenericButton } from '../generic-button';
import { Paper } from '../paper';

import { useIncomingCalling } from './use-incoming-calling';

import './incoming-calling.scss';
import CloseIcon from '@/assets/icons/close-icon.svg';
import EndCallIcon from '@/assets/icons/end-call-icon.svg';
import PhoneFilledIcon from '@/assets/icons/phone-filled.svg';

const cn = classname('incoming-calling');
const t = translateByNamespace('client:loadboard:calling');

export const IncomingCalling = () => {
    const { audioRef, phoneNumber, isPopupVisible, handleAccept, handleReject } = useIncomingCalling();

    if (!isPopupVisible) {
        return null;
    }

    return (
        <Draggable>
            <Paper
                theme='dark'
                className={cn('')}
                body={
                    <div className={cn('body')}>
                        <div className={cn('text')}>{t('incoming-calling')}</div>
                        {/* <div className={cn('avatar')}>
                            <Avatar size='huge' src={incomingObject.avatarUrl} />
                        </div> */}
                        {/* <div className={cn('name')}>{incomingObject.name}</div> */}
                        <div className={cn('phone')}>{formatPhoneNumber(phoneNumber.slice(2))}</div>
                        <div className={cn('text')}>{t('is-calling-you')}</div>

                        <div className={cn('actions')}>
                            <Button view='danger' size='medium' onClick={handleReject}>
                                <PhoneFilledIcon /> {t('reject')}
                            </Button>
                            <Button view='primary-green' size='medium' onClick={handleAccept}>
                                <EndCallIcon /> {t('accept')}
                            </Button>
                        </div>

                        <div className={cn('close')}>
                            <GenericButton figure='circle' size='small' view='blue' onClick={handleReject}>
                                <CloseIcon />
                            </GenericButton>
                        </div>
                        <audio ref={audioRef} src={callingMP3} loop={true} />
                    </div>
                }
            />
        </Draggable>
    );
};
