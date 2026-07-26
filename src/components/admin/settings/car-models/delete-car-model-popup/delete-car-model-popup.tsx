import React, { useCallback, useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { deleteCarModelAction, deleteCarModelPopupPropsSelector } from '@store/admin';
import { carModelsSettingsActions } from '@store/admin/car-models-settings/slice';

export const DeleteCarModelPopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(carModelsSettingsActions.setDeleteCarModelPopupProps({ isVisible: false, carModelId: null, carModelName: null }));
    }, [dispatch]);

    const popupProps = useAppSelector(deleteCarModelPopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.carModelId) {
            dispatch(deleteCarModelAction());
        }
    }, [dispatch, popupProps.carModelId]);

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

    return <Popup isOpen={popupProps.isVisible} onClose={onCloseHandler} title={`Delete '${popupProps.carModelName}' Car Model?`} actions={actions} />;
};
