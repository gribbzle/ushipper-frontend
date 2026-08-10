import { useCallback, useMemo } from 'react';

import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { IssueStatus } from '@enums';
import { useIssue, useIssueHelpers } from '@hooks';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { ISSUE_STATUS_TAG_VIEW } from './constants';

const t = translateByNamespace('admin:accounting:alerts:table');

export const useAlertStatusTag = () => {
    const dispatch = useAppDispatch();
    const { status, id: issueId } = useIssue();
    const { isResolvedStatus, isDeclinedStatus } = useIssueHelpers();

    const variant = useMemo((): string => ISSUE_STATUS_TAG_VIEW[status], [status]);

    const changeAlertStatusHandler = useCallback(
        (status: IssueStatus) => {
            dispatch(
                accountingActions.setAlertStatusChangePopupProps({
                    isPopupOpened: true,
                    issueId,
                    issueStatus: status,
                }),
            );
        },
        [dispatch, issueId],
    );

    const options = useMemo(
        (): DropdownOption[] => [
            {
                label: t('resolve-option'),
                onClick: () => changeAlertStatusHandler(IssueStatus.RESOLVED),
                show: !isResolvedStatus,
            },
            {
                label: t('decline-option'),
                onClick: () => changeAlertStatusHandler(IssueStatus.DECLINED),
                show: !isDeclinedStatus,
            },
        ],
        [changeAlertStatusHandler, isResolvedStatus, isDeclinedStatus],
    );

    return { variant, options };
};
