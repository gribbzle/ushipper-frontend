import React from 'react';

import { ChatMessageExternalStatusesEnum } from '@/enums/chat-message-external-statuses-enum';
import { CallLinesIcon, CrossIcon, HorizontalDotsIcon, PhoneFilledIcon, TickIcon } from '@icons';
import { classname } from '@utils/classname';

import './call-message-icon.scss';

const cn = classname('call-message-icon');

type CallMessageIconProps = {
    view: ChatMessageExternalStatusesEnum;
};

export const CallMessageIcon = ({ view }: CallMessageIconProps) => {
    const showCrossIcon = [ChatMessageExternalStatusesEnum.NO_ANSWER, ChatMessageExternalStatusesEnum.FAILED].includes(view);
    const showLinesIcon = [ChatMessageExternalStatusesEnum.RINGING, ChatMessageExternalStatusesEnum.IN_PROGRESS].includes(view);

    return (
        <div className={cn('', { view })}>
            <PhoneFilledIcon className={cn('phone')} />
            {view === ChatMessageExternalStatusesEnum.COMPLETED && <TickIcon className={cn('check')} />}
            {showCrossIcon && <CrossIcon className={cn('cross')} />}
            {showLinesIcon && <CallLinesIcon className={cn('lines')} />}
            {view === ChatMessageExternalStatusesEnum.QUEUED && <HorizontalDotsIcon className={cn('dots')} />}
        </div>
    );
};
