import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'debounce';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { FormControl, InputLabel, SelectField, StringInput } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import {
    createEditCarModelDrawerPropsSelector,
    createEditCarModelFormSubmit,
    crudSearchCarMakersAction,
    crudSearchCarMakersSelector,
    fetchedCarModelSelector,
} from '@store/admin';
import { carModelsSettingsActions } from '@store/admin/car-models-settings/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import './create-edit-car-model-drawer.scss';

const t = translateByNamespace('admin:car-models-page');
const cn = classname('create-edit-car-model-drawer');

export const CreateEditCarModelDrawer = memo(() => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<any>>();

    const [initialMakersLoaded, setInitialMakersLoaded] = useState(false);

    const createEditCarModelDrawerProps = useAppSelector(createEditCarModelDrawerPropsSelector);
    const { mode } = createEditCarModelDrawerProps;

    const onCloseHandler = useCallback(() => {
        dispatch(
            carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                isVisible: false,
                mode: null,
                carModelId: null,
                carModelName: null,
            }),
        );
        dispatch(carModelsSettingsActions.resetCrudSearchCarMakers());
        setInitialMakersLoaded(false);
    }, [dispatch]);

    const fetchedCarModel = useAppSelector(fetchedCarModelSelector);

    const onSubmit = useCallback(
        (values: any) => {
            const { maker, ...others } = values;

            dispatch(
                createEditCarModelFormSubmit({
                    ...others,
                    carMakerId: maker.value,
                }),
            );
        },
        [dispatch],
    );

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedCarModel) {
            dispatch(
                carModelsSettingsActions.setDeleteCarModelPopupProps({
                    isVisible: true,
                    carModelId: fetchedCarModel.id,
                    carModelName: fetchedCarModel.name,
                }),
            );
        }
    }, [dispatch, fetchedCarModel]);

    const actions = useMemo(() => {
        return (
            <>
                <Button view='primary' onClick={onSubmitHandler}>
                    {mode === 'create' ? t('add-model-button-text') : t('save-model-button-text')}
                </Button>
                {mode === 'edit' && (
                    <Button view='danger' onClick={onDeleteClickHandler}>
                        Delete Model
                    </Button>
                )}
            </>
        );
    }, [mode, onDeleteClickHandler, onSubmitHandler]);

    const onMakerInputChangeHandler = useMemo(() => {
        const fetchCarMakers = (value: string) => {
            dispatch(crudSearchCarMakersAction(value || null));
        };

        return debounce(fetchCarMakers, 300);
    }, [dispatch]);

    useEffect(() => {
        if (fetchedCarModel) {
            dispatch(crudSearchCarMakersAction(fetchedCarModel.maker))
                .unwrap()
                .then(() => {
                    setInitialMakersLoaded(true);
                })
                .catch(() => undefined);
        }
    }, [fetchedCarModel, dispatch]);

    useEffect(() => {
        if (mode === 'create') {
            dispatch(crudSearchCarMakersAction(null));
        }
    }, [dispatch, mode]);
    const crudSearchCarMakers = useAppSelector(crudSearchCarMakersSelector);
    const carMakersOptions = useMemo(
        () => (crudSearchCarMakers ? crudSearchCarMakers.map(({ id, name }: any) => ({ value: id, label: name })) : []),
        [crudSearchCarMakers],
    );

    const initialValues = useMemo(() => {
        if (mode === null || mode === 'create' || (mode === 'edit' && !fetchedCarModel)) {
            return {};
        }

        const { maker, name, weight } = fetchedCarModel;

        return {
            maker: carMakersOptions.find((option: any) => option.label === maker),
            name,
            weight,
        };
    }, [carMakersOptions, fetchedCarModel, mode]);

    const isVisible = createEditCarModelDrawerProps.isVisible && (mode === 'create' || (mode === 'edit' && !!fetchedCarModel && initialMakersLoaded));

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={onCloseHandler}
            head={mode === 'create' ? 'New Model' : fetchedCarModel?.name}
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
                                <FormControl>
                                    <InputLabel required={true}>{t('maker-field-label')}</InputLabel>
                                    <Field
                                        name='maker'
                                        component={SelectField}
                                        validate={required}
                                        callback={onMakerInputChangeHandler}
                                        options={carMakersOptions}
                                        isClearable={false}
                                        placeholder={t('maker-field-placeholder')}
                                    />
                                </FormControl>
                                <Field name='name' label={t('model-field-label')} component={StringInput} validate={required} required={true} />
                                <Field name='weight' label={t('weight-field-label')} type='number' component={StringInput} />
                            </form>
                        );
                    }}
                />
            }
        />
    );
});

CreateEditCarModelDrawer.displayName = 'CreateEditCarModelDrawer';
