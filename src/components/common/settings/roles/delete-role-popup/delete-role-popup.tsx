import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button, Popup } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { deleteRoleAction, deleteRolePopupPropsSelector } from '@store/common';
import { rolesSettingsActions } from '@store/common/roles-settings/slice';

export const DeleteRolePopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(rolesSettingsActions.setDeleteRolePopupProps({ isVisible: false, roleId: null, roleName: null }));
    }, [dispatch]);

    const popupProps = useAppSelector(deleteRolePopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.roleId) {
            dispatch(deleteRoleAction())
                .unwrap()
                .catch(err => toast.error(err.response?.data?.message));
        }
    }, [dispatch, popupProps.roleId]);

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

    return <Popup isOpen={popupProps.isVisible} onClose={onCloseHandler} title={`Delete '${popupProps.roleName}' role?`} actions={actions} />;
};
