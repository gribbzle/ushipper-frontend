import React from 'react';

import { AssignItem } from '@/components/common/assign/assign-item/assign-item';
import { CarIcon, PhoneIcon } from '@icons';
import { classname } from '@utils/classname';
import { isUshipper } from '@utils/project-config';

import './order-driver-assign-item.scss';

const cn = classname('order-driver-assign-item');

type Props = {
    onClick: () => void;
    disabled?: boolean;
    name: string;
    nickname?: string;
    phone: string;
    vehicles: string;
};

export const OrderDriverAssignItem = ({ name, phone, vehicles, nickname, ...props }: Props) => (
    <AssignItem className={cn()} {...props}>
        <div className={cn('title')}>
            {name} {nickname && `(${nickname})`}
        </div>
        <div className={cn('phone')}>
            <PhoneIcon /> {phone}
        </div>
        {isUshipper && (
            <div className={cn('vehicles')}>
                <CarIcon /> {vehicles}
            </div>
        )}
    </AssignItem>
);
