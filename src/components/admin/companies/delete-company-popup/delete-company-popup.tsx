import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Button, Popup } from '@/components/common';
import { useAppDispatch } from '@store';
import { deleteCompanyAction, deleteCompanyPopupPropsSelector } from '@store/admin';
import { companiesActions } from '@store/admin/companies/slice';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:companies-page:delete-company-popup');

export const DeleteCompanyPopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(companiesActions.setDeleteCompanyPopupProps({ isVisible: false, companyId: null, companyName: null }));
    }, [dispatch]);

    const popupProps = useSelector(deleteCompanyPopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.companyId) {
            dispatch(deleteCompanyAction(popupProps.companyId));
        }
    }, [dispatch, popupProps.companyId]);

    const actions = useMemo(
        () => (
            <>
                <Button view='danger' size='small' onClick={onDeleteClickHandler}>
                    {t('delete')}
                </Button>
                <Button view='default' size='small' onClick={onCloseHandler}>
                    {t('cancel')}
                </Button>
            </>
        ),
        [onCloseHandler, onDeleteClickHandler],
    );

    return <Popup isOpen={popupProps.isVisible} onClose={onCloseHandler} title={`Delete ${popupProps.companyName}?`} actions={actions} />;
};
