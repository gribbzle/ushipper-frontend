import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Button, Popup } from '@/components/common';
import { useAppDispatch } from '@store';
import { deleteBlackListItemAction, deleteBlackListItemPopupPropsSelector } from '@store/client';
import { blackListActions } from '@store/common/black-list/slice';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:black-list-page:delete-popup');

export const DeleteBlackListItemPopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(blackListActions.setDeleteBlackListItemPopupProps({ isVisible: false, blackListPublicId: null, blackListName: null }));
    }, [dispatch]);

    const popupProps = useSelector(deleteBlackListItemPopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.blackListPublicId) {
            dispatch(deleteBlackListItemAction(popupProps.blackListPublicId));
        }
    }, [dispatch, popupProps.blackListPublicId]);

    const actions = useMemo(
        () => (
            <>
                <Button view='danger' size='small' onClick={onDeleteClickHandler}>
                    {t('delete-action')}
                </Button>
                <Button view='default' size='small' onClick={onCloseHandler}>
                    {t('cancel-action')}
                </Button>
            </>
        ),
        [onCloseHandler, onDeleteClickHandler],
    );

    return <Popup isOpen={popupProps.isVisible} onClose={onCloseHandler} title={t('title', { name: popupProps.blackListName ?? '' })} actions={actions} />;
};
