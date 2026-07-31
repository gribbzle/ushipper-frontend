import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { Button, Drawer } from '@/components/common';
import { StringInput } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { createEditCarMakerDrawerPropsSelector, createEditCarMakerFormSubmit, fetchedCarMakerSelector } from '@store/admin';
import { carMakersSettingsActions } from '@store/admin/car-makers-settings/slice';
import { classname } from '@utils/classname';
import { required } from '@validators';

import './create-update-car-maker-drawer.scss';

const cn = classname('create-update-car-maker-drawer');

export const CreateUpdateCarMakerDrawer = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<any>>();

    const createEditCarMakerDrawerProps = useAppSelector(createEditCarMakerDrawerPropsSelector);
    const { mode } = createEditCarMakerDrawerProps;

    const onCloseHandler = useCallback(() => {
        dispatch(
            carMakersSettingsActions.setCreateEditCarMakerDrawerProps({
                isVisible: false,
                mode: null,
                carMakerId: null,
                carMakerName: null,
            }),
        );
    }, [dispatch]);

    const fetchedCarMaker = useAppSelector(fetchedCarMakerSelector);
    const isVisible = createEditCarMakerDrawerProps.isVisible && (mode === 'create' || (mode === 'edit' && !!fetchedCarMaker));
    const initialValues = useMemo(() => (mode === 'edit' && fetchedCarMaker ? { name: fetchedCarMaker.name } : {}), [fetchedCarMaker, mode]);

    const onSubmit = useCallback(
        (values: any) => {
            dispatch(createEditCarMakerFormSubmit(values));
        },
        [dispatch],
    );

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedCarMaker) {
            dispatch(
                carMakersSettingsActions.setDeleteCarMakerPopupProps({
                    isVisible: true,
                    carMakerId: fetchedCarMaker.id,
                    carMakerName: fetchedCarMaker.name,
                }),
            );
        }
    }, [dispatch, fetchedCarMaker]);

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' onClick={onSubmitHandler}>
                    {mode === 'create' ? 'Add Maker' : 'Save Maker'}
                </Button>
                {mode === 'edit' && (
                    <Button view='danger' onClick={onDeleteClickHandler}>
                        Delete Maker
                    </Button>
                )}
            </>
        ),
        [mode, onDeleteClickHandler, onSubmitHandler],
    );

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={onCloseHandler}
            head={mode === 'create' ? 'New Maker' : fetchedCarMaker?.name}
            actions={actions}
            body={
                <Form<any>
                    onSubmit={onSubmit}
                    validateOnBlur={true}
                    initialValues={initialValues}
                    render={({ form, handleSubmit }) => {
                        formRef.current = form;

                        return (
                            <form onSubmit={handleSubmit} name='create-edit-user-form'>
                                <Field name='name' label='Maker Name' component={StringInput} validate={required} required={true} />
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
