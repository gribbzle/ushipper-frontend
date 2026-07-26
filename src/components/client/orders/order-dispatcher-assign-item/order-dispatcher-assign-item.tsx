import React from 'react';

import { AssignItem } from '@components';
import { PhoneIcon } from '@icons';
import { classname } from '@utils';

import './order-dispatcher-assign-item.scss';

const cn = classname('order-dispatcher-assign-item');

type Props = {
    onClick: () => void;
    disabled?: boolean;
    name: string;
    nickname?: string;
    phone: string;
};

export const OrderDispatcherAssignItem = ({ name, nickname, phone, ...props }: Props) => (
    <AssignItem className={cn()} {...props}>
        <div className={cn('title')}>
            {name} {nickname && `(${nickname})`}
        </div>
        <div className={cn('phone')}>
            <PhoneIcon /> {phone}
        </div>
    </AssignItem>
);
