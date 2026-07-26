import React, { useCallback } from 'react';

import { useIssue, useIssueHelpers } from '@hooks';
import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';
import { classname, translateByNamespace, translateIssueType } from '@utils';

import './alert-type-info.scss';

const cn = classname('alert-type-info');
const t = translateByNamespace('client:order:activity');

export const AlertTypeInfo = () => {
    const dispatch = useAppDispatch();
    const { type, payload, createdAt } = useIssue();
    const { changedBy } = useIssueHelpers();

    const handleOpenActivityDetailsDrawerClick = useCallback(() => {
        if (payload) {
            dispatch(
                ordersActions.setOrderActivityDetailsDrawerProps({
                    isVisible: true,
                    details: payload,
                    createdAt,
                    creatorName: changedBy?.name ?? t('system-name'),
                }),
            );
        }
    }, [dispatch, payload, createdAt, changedBy]);

    return (
        <span className={cn('', { disabled: !payload })} onClick={handleOpenActivityDetailsDrawerClick}>
            {translateIssueType(type)}
        </span>
    );
};
