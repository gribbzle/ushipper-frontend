import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button, Popup } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, alertStatusChangePopupPropsSelector } from '@store/admin';
import { issuesApi, usePartiallyUpdateIssueMutation } from '@store/api/issues-api';
import {
    classname,
    isIssueResolved,
    renderTextWithBreakLines,
    translateAlertErrorNotification,
    translateAlertSuccessNotification,
    translateByNamespace,
} from '@utils';

import './alert-status-change-popup.scss';

const t = translateByNamespace('admin:accounting:alerts:alert-status-change-popup');
const tTable = translateByNamespace('admin:accounting:alerts:table');

const cn = classname('alert-status-change-popup');

export const AlertStatusChangePopup = () => {
    const dispatch = useAppDispatch();
    const [updateAlert, { isLoading }] = usePartiallyUpdateIssueMutation();
    const { isPopupOpened, issueStatus, issueId } = useAppSelector(alertStatusChangePopupPropsSelector);

    const onClosePopupHandler = useCallback(() => {
        dispatch(
            accountingActions.setAlertStatusChangePopupProps({
                isPopupOpened: false,
                issueId: null,
                issueStatus: null,
            }),
        );
    }, [dispatch]);

    const isResolve = useMemo(() => issueStatus && isIssueResolved(issueStatus), [issueStatus]);

    const changeAlertStatusHandler = useCallback(() => {
        if (issueStatus && issueId) {
            updateAlert({ issueId, data: { status: issueStatus } })
                .unwrap()
                .then(() => {
                    toast.success(translateAlertSuccessNotification(issueStatus));
                    dispatch(issuesApi.util.invalidateTags([{ type: 'Issues', id: 'LIST' }]));
                    onClosePopupHandler();
                })
                .catch(() => {
                    toast.error(translateAlertErrorNotification(issueStatus));
                });
        }
    }, [dispatch, updateAlert, onClosePopupHandler, issueId, issueStatus]);

    const actions = useMemo(
        () => (
            <>
                <Button disabled={isLoading} size='small' view={isResolve ? 'primary' : 'danger'} onClick={changeAlertStatusHandler}>
                    {tTable(isResolve ? 'resolve-option' : 'decline-option')}
                </Button>
                <Button size='small' onClick={onClosePopupHandler}>
                    {t(isResolve ? 'cancel-action' : 'close-action')}
                </Button>
            </>
        ),
        [changeAlertStatusHandler, onClosePopupHandler, isLoading, isResolve],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onClose={onClosePopupHandler}
            title={renderTextWithBreakLines(t(`${issueStatus}-title`))}
            actions={actions}
            size='medium'
            className={cn('')}
        />
    );
};
