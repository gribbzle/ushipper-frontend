import React from 'react';

import { GenericButton } from '@/components/common/generic-button/generic-button';
import { classname } from '@utils/classname';

import { fromPhoneTypeToTranslation } from './from-phone-type-to-translation';
import { PhoneItemProps } from './phone-item.types';

import './phone-item.scss';
import MessageOutlinedIcon from '@/assets/icons/message-outlined.svg';
import PhoneOutlinedIcon from '@/assets/icons/phone-outlined.svg';

const cn = classname('phone-item');

export const PhoneItem = ({ type, phoneNumber, isMessage = false, onClick }: PhoneItemProps) => (
    <div className={cn('')}>
        <div className={cn('text')}>
            {fromPhoneTypeToTranslation.get(type)}: {phoneNumber}
        </div>
        <GenericButton figure='circle' view='accent' size='small' onClick={onClick}>
            {isMessage ? <MessageOutlinedIcon /> : <PhoneOutlinedIcon />}
        </GenericButton>
    </div>
);
