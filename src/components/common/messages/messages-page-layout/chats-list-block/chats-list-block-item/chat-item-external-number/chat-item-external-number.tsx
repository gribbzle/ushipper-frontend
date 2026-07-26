import React from 'react';

import { classname, formatExternalPhoneNumber } from '@utils';

import './chat-item-external-number.scss';

const cn = classname('chat-item-external-number');

export const ChatItemExternalNumber = ({ externalNumber }: { externalNumber?: string | null }) => {
    if (!externalNumber) {
        return null;
    }

    return <h4 className={cn()}>{formatExternalPhoneNumber(externalNumber)}</h4>;
};
