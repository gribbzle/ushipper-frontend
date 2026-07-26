import React, { ReactNode } from 'react';

import { Avatar } from '@/components/common';
import { User } from '@store/common';
import { classname } from '@utils';

import './notification-item.scss';

const cn = classname('notification-item');

type Props = {
    children?: ReactNode;
    dropdown?: ReactNode;
    className?: string;
    user: User;
    date: Date;
};

export const NotificationItem = ({ children, user, className, date, dropdown }: Props) => (
    <div className={cn('', [className])}>
        <div className={cn('header')}>
            <Avatar src={user.avatar?.url} />
            <div className={cn('header', 'info')}>
                <p className={cn('header', 'user-name')}>{user.name}</p>
                <p className={cn('header', 'date')}>{date.diffForHumans()}</p>
            </div>
            {dropdown}
        </div>
        {children}
    </div>
);
