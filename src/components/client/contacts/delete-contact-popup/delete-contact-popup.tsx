import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Button, Popup } from '@/components/common';
import { useAppDispatch } from '@store';
import { deleteContactAction, deleteContactPopupPropsSelector } from '@store/client';
import { contactsActions } from '@store/common/contacts/slice';

export const DeleteContactPopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(contactsActions.setDeleteContactPopupProps({ isVisible: false, contactId: null, contactName: null }));
    }, [dispatch]);

    const popupProps = useSelector(deleteContactPopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.contactId) {
            dispatch(deleteContactAction(popupProps.contactId));
        }
    }, [dispatch, popupProps.contactId]);

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

    return <Popup isOpen={popupProps.isVisible} onClose={onCloseHandler} title={`Delete ${popupProps.contactName}?`} actions={actions} />;
};
