import React, { useCallback } from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { GenericButton } from '@/components/common/generic-button/generic-button';
import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';
import { Avatar as AvatarType } from '@store/common/staff/avatar-types';
import { RatingOneStarIcon } from '@/components/ui/inputs/rating';
import { classname } from '@utils/classname';

import './tracking-driver-info.scss';
import LetterIcon2 from '@/assets/icons/letter-icon2.svg';
import LikeIcon from '@/assets/icons/like-icon.svg';

type TrackingDriverInfoProps = {
    userName: string;
    rating?: number | null;
    companyName: string;
    avatar: AvatarType | null;
    orderPublicId: string;
    showLike?: boolean;
    inline?: boolean;
};

const cn = classname('tracking-driver-info');

export const TrackingDriverInfo = ({ orderPublicId, userName, companyName, avatar, rating = 0, inline = false, showLike = false }: TrackingDriverInfoProps) => {
    const dispatch = useAppDispatch();

    const ratingValue = rating ?? 0;

    const handleOpenOrderChatDrawer = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();

            dispatch(ordersActions.setOrderChatDrawerProps({ isVisible: true, orderPublicId }));
        },
        [dispatch, orderPublicId],
    );

    return (
        <div className={cn('', { inline })}>
            <Avatar src={avatar?.url} className={cn('avatar')} />
            <div>
                <div className={cn('details')}>
                    <div className={cn('name')}>
                        <h4>{userName}</h4>
                        {/* // TODO show after backend is ready     */}
                        {showLike && (
                            <div className={cn('like')}>
                                <LikeIcon />
                            </div>
                        )}
                    </div>
                    <div className={cn('rating')}>
                        <RatingOneStarIcon initialValue={ratingValue} />
                        <span>{ratingValue.toFixed(1)}</span>
                    </div>
                </div>
                {inline && <p className={cn('company')}>{companyName}</p>}
            </div>
            <GenericButton figure='circle' size='large' view='primary' onClick={e => handleOpenOrderChatDrawer(e)}>
                <LetterIcon2 />
            </GenericButton>
        </div>
    );
};
