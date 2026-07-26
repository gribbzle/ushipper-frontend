import React from 'react';

import { Avatar } from '@components';
import { User } from '@store/common';
import { classname, getCompanyTypeTranslate } from '@utils';

import './user-details.scss';

const cn = classname('user-details');

export const UserDetails = ({ driver: { avatar, name, nickname } }: { driver: User }) => {
    return (
        <div className={cn('')}>
            <Avatar src={avatar?.url} />

            <div className={cn('wrapper')}>
                <span className={cn('name')}>
                    {name}
                    {nickname && ` (${nickname})`}
                </span>
                <span className={cn('company-type')}>{getCompanyTypeTranslate('driver')}</span>
            </div>
        </div>
    );
};
