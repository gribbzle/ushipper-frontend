import React from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { RatingOneStarIcon } from '@/components/ui/inputs/rating';
import { classname } from '@utils/classname';

import './manager-info.scss';

type ManagerInfoProps = {
    avatarUrl?: string;
    name: string;
    nickName?: string | null;
    companyName?: string;
    rating?: number | null;
    size?: 'default' | 'medium';
};

const cn = classname('manager-info');

export const ManagerInfo = ({ avatarUrl, name, nickName, companyName, rating, size = 'default' }: ManagerInfoProps) => (
    <div className={cn('', { size })}>
        <Avatar src={avatarUrl} />
        <div className={cn('details')}>
            <div className={cn('name-and-rating')}>
                {name} {!!nickName && `(${nickName})`}
                {rating && (
                    <div className={cn('rating')}>
                        <RatingOneStarIcon initialValue={rating} />
                        <span>{rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
            {companyName && <span className={cn('company')}>{companyName}</span>}
        </div>
    </div>
);
