import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { CommodityDimensionUnitEnum, CommodityTemperatureUnitEnum, CommodityWeightUnitEnum } from '@/enums';
import { CommodityTypesSelect, Divider, FreightClassesSelect, HazmatClassesSelect, PackingGroupSelect } from '@components';
import { FormControl, InputLabel, SwitchInput, TextField } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { useCreateOrderCommodityMutation, useGetOrderCommodityQuery, useUpdateOrderCommodityMutation } from '@store/api/order-commodity-api';
import { ordersApi } from '@store/api/orders-api';
import { CommodityFormState, orderPublicIdSelector } from '@store/common';
import { classname, getObjectWithoutEmptyFields, hasNonUnitCommodityFields, parseField, translateByNamespace } from '@utils';

import './order-commodity-form.scss';

const t = translateByNamespace('client:order:commodities:fields');
const TNot = translateByNamespace('client:order:notifications');
const cn = classname('order-commodity-form');

type OrderCommodityFormProps = {
    commodityId: string | null;
    formId: string;
    onAfterFormSubmit: () => void;
};

const prepareCommodityValues = (values: CommodityFormState): CommodityFormState => {
    const cleanedValues = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === '' ? null : value])) as CommodityFormState;

    return { ...cleanedValues };
};

export const OrderCommodityForm = ({ commodityId, formId, onAfterFormSubmit }: OrderCommodityFormProps) => {
    const formRef = useRef<FormApi<CommodityFormState>>();
    const orderId = useAppSelector(orderPublicIdSelector) as string;

    const {
        data: commodity,
        isSuccess,
        isError,
    } = useGetOrderCommodityQuery({ orderId: orderId ?? '', commodityId: commodityId ?? '' }, { skip: !orderId || !commodityId });

    const [createCommodity] = useCreateOrderCommodityMutation();
    const [updateCommodity] = useUpdateOrderCommodityMutation();

    const isEditMode = !!commodityId;

    const dispatch = useAppDispatch();
    const handleSubmit = useCallback(
        async (values: CommodityFormState) => {
            if (!orderId) {
                return;
            }

            const preparedValues = prepareCommodityValues(values);

            if (!hasNonUnitCommodityFields(preparedValues)) {
                return;
            }

            let successMessage = '';
            let errorMessage = '';

            try {
                if (isEditMode) {
                    successMessage = TNot('edit-commodity-success-message');
                    errorMessage = TNot('edit-commodity-error-message');

                    await updateCommodity({ orderId, commodityId, data: preparedValues }).unwrap();
                } else {
                    successMessage = TNot('add-commodity-success-message');
                    errorMessage = TNot('add-commodity-error-message');

                    await createCommodity({ orderId, data: preparedValues }).unwrap();
                }
                dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));
                toast.success(successMessage);
                onAfterFormSubmit();
            } catch {
                toast.error(errorMessage);
            }
        },
        [isEditMode, orderId, commodityId, createCommodity, onAfterFormSubmit, updateCommodity, dispatch],
    );

    const initialValues = useMemo((): CommodityFormState => {
        if (!commodity) {
            return {
                weightUnit: CommodityWeightUnitEnum.POUNDS,
                temperatureUnit: CommodityTemperatureUnitEnum.FAHRENHEIT,
                dimensionUnit: CommodityDimensionUnitEnum.INCHES,
            };
        }

        const { weightUnit, temperatureUnit, ...rest } = commodity;

        return getObjectWithoutEmptyFields({
            ...rest,
            weightUnit: weightUnit ?? CommodityWeightUnitEnum.POUNDS,
            temperatureUnit: temperatureUnit ?? CommodityTemperatureUnitEnum.FAHRENHEIT,
        });
    }, [commodity]);

    useEffect(() => {
        if (commodityId && isError) {
            toast.error<string>(TNot('upload-commodity-error-notification'));
        }
    }, [isError, commodityId]);

    if (commodityId && !isSuccess) {
        return null;
    }

    return (
        <Form<CommodityFormState>
            onSubmit={handleSubmit}
            initialValues={initialValues}
            render={({ form, handleSubmit, values: { weightUnit, temperatureUnit, dimensionUnit } }) => {
                formRef.current = form;

                return (
                    <form className={cn()} id={formId} onSubmit={handleSubmit}>
                        <div className={cn('first-group')}>
                            <FormControl>
                                <InputLabel>{t('description-label')}</InputLabel>
                                <Field name='description' component={TextField} placeholder='' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('quantity-label')}</InputLabel>
                                <Field name='quantity' component={TextField} placeholder='' type='number' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('type-label')}</InputLabel>
                                <Field name='type' component={CommodityTypesSelect} placeholder='' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('weight-label')}</InputLabel>
                                <Field
                                    name='weight'
                                    component={TextField}
                                    placeholder=''
                                    type='number'
                                    endAdornment={weightUnit ?? CommodityWeightUnitEnum.POUNDS}
                                    parse={parseField}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('pieces-label')}</InputLabel>
                                <Field name='pieces' component={TextField} placeholder='' type='number' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('class-label')}</InputLabel>
                                <Field name='freightClass' component={FreightClassesSelect} placeholder='' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('length-label')}</InputLabel>
                                <Field
                                    name='length'
                                    component={TextField}
                                    placeholder=''
                                    type='number'
                                    endAdornment={dimensionUnit ?? CommodityDimensionUnitEnum.INCHES}
                                    parse={parseField}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('width-label')}</InputLabel>
                                <Field
                                    name='width'
                                    component={TextField}
                                    placeholder=''
                                    type='number'
                                    endAdornment={dimensionUnit ?? CommodityDimensionUnitEnum.INCHES}
                                    parse={parseField}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('height-label')}</InputLabel>
                                <Field
                                    name='height'
                                    component={TextField}
                                    placeholder=''
                                    type='number'
                                    endAdornment={dimensionUnit ?? CommodityDimensionUnitEnum.INCHES}
                                    parse={parseField}
                                />
                            </FormControl>
                        </div>
                        <Divider>{t('divider-label')}</Divider>
                        <div className={cn('second-group')}>
                            <FormControl>
                                <InputLabel>{t('name-label')}</InputLabel>
                                <Field name='name' component={TextField} placeholder='' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('packing-group-label')}</InputLabel>
                                <Field name='packingGroup' component={PackingGroupSelect} placeholder='' parse={parseField} />
                            </FormControl>

                            <FormControl>
                                <InputLabel>{t('volume-label')}</InputLabel>
                                <Field name='volume' component={TextField} placeholder='' type='number' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('linear-feet-label')}</InputLabel>
                                <Field name='linearFeet' component={TextField} placeholder='' type='number' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('min-temperature-label')}</InputLabel>
                                <Field
                                    name='minTemperature'
                                    component={TextField}
                                    placeholder=''
                                    type='number'
                                    endAdornment={temperatureUnit ?? CommodityTemperatureUnitEnum.FAHRENHEIT}
                                    parse={parseField}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('max-temperature-label')}</InputLabel>
                                <Field
                                    name='maxTemperature'
                                    component={TextField}
                                    placeholder=''
                                    type='number'
                                    endAdornment={temperatureUnit ?? CommodityTemperatureUnitEnum.FAHRENHEIT}
                                    parse={parseField}
                                />
                            </FormControl>
                        </div>
                        <div className={cn('first-group')}>
                            <FormControl>
                                <InputLabel>{t('nmfc-code-label')}</InputLabel>
                                <Field name='nmfcCode' component={TextField} placeholder='' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('sku-number-label')}</InputLabel>
                                <Field name='skuNumber' component={TextField} placeholder='' parse={parseField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('un-number-label')}</InputLabel>
                                <Field name='unNumber' component={TextField} placeholder='' type='number' parse={parseField} />
                            </FormControl>
                        </div>
                        <div className={cn('switches-container')}>
                            <Field label={t('stackable-label')} name='stackable' component={SwitchInput} />
                            <Field label={t('hazardous-label')} name='hazardous' component={SwitchInput} />
                        </div>
                        <div className={cn('second-group')}>
                            <FormControl>
                                <InputLabel>{t('hazmat-class-label')}</InputLabel>
                                <Field name='hazmatClass' component={HazmatClassesSelect} placeholder='' parse={parseField} />
                            </FormControl>
                        </div>
                    </form>
                );
            }}
        />
    );
};
