import React, { useCallback, useMemo } from 'react';

import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { CarrierAccountingDrawerTab } from '@/enums';
import { useLoginAs, useOpenDeleteCompanyPopup } from '@hooks';
import { useAppDispatch } from '@store';
import { accountingActions, Company } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:company-card-info');

export const CompanyActionsCard = ({ name, isPartner, publicId, owner, enablePaymentSystem }: Company) => {
    const dispatch = useAppDispatch();
    const handleLoginAs = useLoginAs();

    const onOpenDeleteCompanyPopup = useOpenDeleteCompanyPopup();

    const onEditClickHandler = useCallback(() => {
        dispatch(
            accountingActions.setCarrierAccountingDrawerProps({
                isDrawerOpened: true,
                title: name,
                companyId: publicId,
                isPartner,
                selectedTab: CarrierAccountingDrawerTab.FEES,
                enablePaymentSystem,
            }),
        );
    }, [dispatch, isPartner, name, publicId, enablePaymentSystem]);

    const onDeleteClickHandler = useCallback(
        () =>
            onOpenDeleteCompanyPopup({
                companyId: publicId,
                companyName: name,
            }),
        [publicId, name, onOpenDeleteCompanyPopup],
    );

    const handleLoginAsHandler = useCallback(
        () =>
            handleLoginAs({
                userPublicId: owner.publicId,
                isNewAccountDispatcher: false,
            }),
        [handleLoginAs, owner.publicId],
    );

    const options = useMemo<Array<DropdownOption>>(() => {
        return [
            {
                label: t('login-as-owner-button'),
                onClick: handleLoginAsHandler,
            },
            {
                label: t('edit-button'),
                onClick: onEditClickHandler,
            },
            {
                label: t('delete-button'),
                onClick: onDeleteClickHandler,
            },
        ];
    }, [onEditClickHandler, onDeleteClickHandler, handleLoginAsHandler]);

    return <TableRowMenu options={options} dataTestId='company-card-actions' />;
};
