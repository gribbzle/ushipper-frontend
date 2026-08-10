import React, { useCallback } from 'react';

import { useIssue } from '@/hooks/issue/useIssue';
import { useIssueHelpers } from '@/hooks/issue/useIssueHelpers';
import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateIssueType } from '@utils/translate/issue/translate-issue-type';

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
