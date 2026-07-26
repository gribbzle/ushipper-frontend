import React, { MouseEvent, useCallback, useMemo } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { LatestLocation } from '@store/client';
import { classname, diffForHumans } from '@utils';

import './latest-location-block.scss';

type LatestLocationInfoProps = {
    latestLocation: LatestLocation | null;
    accountName: string;
    accountId: string;
    users: AccountingAccountUserData[];
};

const cn = classname('latest-location-block');

export const LatestLocationInfo = ({ latestLocation, accountName, accountId, users }: LatestLocationInfoProps) => {
    const { createdAt } = latestLocation || {};
    const dispatch = useAppDispatch();
    const latestLocationDateInfo = useMemo(() => (createdAt ? diffForHumans(new Date(createdAt)) : '—'), [createdAt]);

    const handleLocationClick = useCallback(
        (e: MouseEvent<HTMLSpanElement>) => {
            e.stopPropagation();
            dispatch(accountingActions.setDriversMapPopupProps({ isPopupOpened: true, driverName: accountName, users, driverAccountId: accountId }));
        },
        [dispatch, accountName, accountId, users],
    );

    return (
        <div className={cn('')}>
            {latestLocation ? (
                <span className={cn('time')} onClick={e => handleLocationClick(e)}>
                    {latestLocationDateInfo}
                </span>
            ) : (
                '—'
            )}
        </div>
    );
};
