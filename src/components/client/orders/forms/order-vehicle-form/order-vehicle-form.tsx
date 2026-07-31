import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { Divider } from '@/components/common/divider/divider';
import { FieldCurrencyPrepend } from '@/components/common/field-currency-prepend/field-currency-prepend';
import { VehicleMakerInput } from '@/components/common/vehicle-maker-input/vehicle-maker-input';
import { VehicleModelInput } from '@/components/common/vehicle-model-input/vehicle-model-input';
import { VehicleTypesSelect } from '@/components/common/vehicle-types-select/vehicle-types-select';
import { VehicleVinInput } from '@/components/common/vehicle-vin-input/vehicle-vin-input';
import { VehicleType } from '@enums';
import { FormControl, InputLabel, SwitchInput, TextField } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { useCreateOrderVehicleMutation, useGetOrderVehiclesQuery, useUpdateOrderVehicleMutation } from '@store/api/order-vehicle-api';
import { ordersApi } from '@store/api/orders-api';
import { orderPublicIdSelector, VehicleFormState } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { required } from '@validators';

import './order-vehicle-form.scss';

const t = translateByNamespace('client:order:vehicles:fields');
const tPlaceholder = translateByNamespace('client:order:fields');
const notificationTranslate = translateByNamespace('client:order:notifications');
const cn = classname('order-vehicle-form');

type OrderVehicleFormProps = {
    vehicleId: number | null;
    formId: string;
    onAfterFormSubmit: () => void;
};

export const OrderVehicleForm = ({ vehicleId, formId, onAfterFormSubmit }: OrderVehicleFormProps) => {
    const formRef = useRef<FormApi<VehicleFormState>>();

    const orderId = useAppSelector(orderPublicIdSelector) as string;

    const { vehicle } = useGetOrderVehiclesQuery(orderId, {
        skip: !orderId || !vehicleId,
        selectFromResult: ({ data }) => ({ vehicle: data?.find(vehicle => vehicle.id === vehicleId) }),
    });

    const [createVehicle] = useCreateOrderVehicleMutation();
    const [updateVehicle] = useUpdateOrderVehicleMutation();

    const isEditMode = !!vehicleId;

    const dispatch = useAppDispatch();
    const handleSubmit = useCallback(
        async (values: VehicleFormState) => {
            if (!orderId) {
                return;
            }

            let successMessage = '';
            let errorMessage = '';

            try {
                if (isEditMode) {
                    successMessage = notificationTranslate('edit-vehicle-success-message');
                    errorMessage = notificationTranslate('edit-vehicle-error-message');

                    await updateVehicle({ orderId, vehicleId, data: values }).unwrap();
                } else {
                    successMessage = notificationTranslate('add-vehicle-success-message');
                    errorMessage = notificationTranslate('add-vehicle-error-message');

                    await createVehicle({ orderId, data: values }).unwrap();
                }
                dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));
                toast.success(successMessage);
                onAfterFormSubmit();
            } catch {
                toast.error(errorMessage);
            }
        },
        [isEditMode, orderId, vehicleId, createVehicle, onAfterFormSubmit, updateVehicle, dispatch],
    );

    const initialValues = useMemo((): VehicleFormState => {
        if (!vehicle) {
            return {
                type: VehicleType.OTHER,
            };
        }

        const { color, enclosed, inop, lotNumber, make, model, price, type, vin, year } = vehicle;

        return getObjectWithoutEmptyFields({
            color,
            enclosed,
            inop,
            lotNumber,
            make,
            model,
            price: price ? price.toString() : null,
            type: type,
            vin,
            year: year ? year.toString() : null,
        });
    }, [vehicle]);

    return (
        <Form<VehicleFormState>
            onSubmit={handleSubmit}
            initialValues={initialValues}
            render={({ form, handleSubmit }) => {
                formRef.current = form;

                return (
                    <form className={cn()} id={formId} onSubmit={handleSubmit}>
                        <FormControl className={cn('vin')}>
                            <InputLabel>{t('vin-label')}</InputLabel>
                            <Field name='vin' component={VehicleVinInput} placeholder={tPlaceholder('no-placeholder')} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('year-label')}</InputLabel>
                            <Field name='year' component={TextField} type='number' placeholder={tPlaceholder('no-placeholder')} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('make-label')}</InputLabel>
                            <Field name='make' component={VehicleMakerInput} placeholder={tPlaceholder('no-placeholder')} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('model-label')}</InputLabel>
                            <Field name='model' component={VehicleModelInput} placeholder={tPlaceholder('no-placeholder')} />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('type-label')}</InputLabel>
                            <Field
                                name='type'
                                component={VehicleTypesSelect}
                                validate={required}
                                displayAllOptions={true}
                                placeholder={tPlaceholder('no-placeholder')}
                                isClearable={false}
                            />
                        </FormControl>
                        <div className={cn('switches-container')}>
                            <Field label={t('inop-label')} name='inop' component={SwitchInput} />
                            <Field label={t('enclosed-label')} name='enclosed' component={SwitchInput} />
                        </div>
                        <Divider className={cn('divider')}>{t('divider-label')}</Divider>
                        <FormControl>
                            <InputLabel>{t('color-label')}</InputLabel>
                            <Field name='color' component={TextField} placeholder={tPlaceholder('no-placeholder')} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('price-label')}</InputLabel>
                            <Field
                                name='price'
                                component={TextField}
                                adornment={<FieldCurrencyPrepend />}
                                type='number'
                                placeholder={tPlaceholder('no-placeholder')}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('lot-number-label')}</InputLabel>
                            <Field name='lotNumber' component={TextField} placeholder={tPlaceholder('no-placeholder')} />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
