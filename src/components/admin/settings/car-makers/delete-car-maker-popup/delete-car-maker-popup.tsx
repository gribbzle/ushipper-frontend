import React, { useCallback, useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { deleteCarMakerAction, deleteCarMakerPopupPropsSelector } from '@store/admin';
import { carMakersSettingsActions } from '@store/admin/car-makers-settings/slice';

export const DeleteCarMakerPopup = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(carMakersSettingsActions.setDeleteCarMakerPopupProps({ isVisible: false, carMakerId: null, carMakerName: null }));
    }, [dispatch]);

    const popupProps = useAppSelector(deleteCarMakerPopupPropsSelector);

    const onDeleteClickHandler = useCallback(() => {
        if (popupProps.carMakerId) {
            dispatch(deleteCarMakerAction());
        }
    }, [dispatch, popupProps.carMakerId]);

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

    return <Popup isOpen={popupProps.isVisible} onClose={onCloseHandler} title={`Delete '${popupProps.carMakerName}' Car Maker?`} actions={actions} />;
};
