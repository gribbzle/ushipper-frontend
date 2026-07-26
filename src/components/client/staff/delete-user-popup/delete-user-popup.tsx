import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Button, Popup } from '@/components/common';
import { useAppDispatch } from '@store';
import { deleteUserAction, deleteUserPopupPropsSelector } from '@store/client';
import { staffActions } from '@store/common/staff/slice';

export const DeleteUserPopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(staffActions.setDeleteUserPopupProps({ isVisible: false, userId: null, userName: null, isAccountContext: false }));
    }, [dispatch]);

    const popupProps = useSelector(deleteUserPopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.userId) {
            dispatch(deleteUserAction({ userPublicId: popupProps.userId, isAccountContext: popupProps.isAccountContext }));
        }
    }, [dispatch, popupProps.userId, popupProps.isAccountContext]);

    const actions = useMemo(
        () => (
            <>
                <Button view='danger' size='small' onClick={onDeleteClickHandler}>
                    Delete
                </Button>
                <Button view='default' size='small' onClick={onCloseHandler}>
                    Cancel
                </Button>
            </>
        ),
        [onCloseHandler, onDeleteClickHandler],
    );

    return <Popup isOpen={popupProps.isVisible} onTop={true} onClose={onCloseHandler} title={`Delete ${popupProps.userName}?`} actions={actions} />;
};
