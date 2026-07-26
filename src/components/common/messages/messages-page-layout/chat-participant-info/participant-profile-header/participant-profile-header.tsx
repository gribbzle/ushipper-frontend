import React from 'react';

import { Avatar } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import { ChatAccountInfo, ChatUserInfo } from '@store/common/chats/types';
import { classname } from '@utils';

import './participant-profile-header.scss';

type ParticipantProfileHeaderProps = {
    account: ChatAccountInfo;
    user: ChatUserInfo;
};

const cn = classname('participant-profile-header');

export const ParticipantProfileHeader = ({ account, user }: ParticipantProfileHeaderProps) => {
    const { name } = account;
    const { avatar } = user;

    return (
        <div className={cn('')}>
            <Badge size='default'>
                <Avatar className={cn('avatar')} src={avatar?.url} />
            </Badge>
            <h4 className={cn('name')}>{name}</h4>
        </div>
    );
};
