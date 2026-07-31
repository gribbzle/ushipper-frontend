import React, { useCallback, useMemo } from 'react';

import { Button } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, ReportType, selectedAccountSelector } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';

import './accounting-drawer-header.scss';

const cn = classname('accounting-drawer-header');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer');

export const AccountingDrawerHeader = () => {
    const account = useAppSelector(selectedAccountSelector);
    const dispatch = useAppDispatch();

    const title = useMemo(() => account?.name ?? '', [account]);

    const handleOpenReportPopup = useCallback(
        (reportType: ReportType) => {
            if (!account) return;

            dispatch(
                accountingActions.setReportPopupProps({
                    isPopupOpened: true,
                    name: account.name,
                    accountId: account.publicId,
                    reportType,
                }),
            );
        },
        [dispatch, account],
    );

    return (
        <div className={cn()}>
            {title}
            {account && (
                <>
                    <Button view='default' size='medium' onClick={() => handleOpenReportPopup(isFreightX ? 'cashout' : 'statementV1')}>
                        {t('statement-v1-report-btn')}
                    </Button>
                    <Button view='default' size='medium' onClick={() => handleOpenReportPopup('statementV2')}>
                        {t('statement-v2-report-btn')}
                    </Button>
                    <Button view='default' size='medium' onClick={() => handleOpenReportPopup('balance')}>
                        {t('balance-report-btn')}
                    </Button>
                </>
            )}
        </div>
    );
};
