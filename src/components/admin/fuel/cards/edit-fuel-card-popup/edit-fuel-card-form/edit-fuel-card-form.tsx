import React from 'react';
import { Field, FieldRenderProps, Form } from 'react-final-form';

import {CurrencyInput} from '@/fields/currency-input';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {NativeSwitch, NativeSwitchProps} from '@/fields/switch-input';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getGallonsTranslate } from '@utils/translate/get-units-of-measurement-translate';
import { requiredCurrency } from '@validators';

import { EditFuelCardFormState, EditFuelCardToDriverFormProps } from './edit-fuel-card-form.types';
import { useEditFuelCardForm } from './use-edit-fuel-card-form';

import './edit-fuel-card-form.scss';

const t = translateByNamespace('admin:fuel:cards-page:edit-fuel-card-popup');
const cn = classname('edit-fuel-card-form');

const calculateLimitWithRate = ({ rate, value }: { rate: number; value?: number | string | null }): string | null => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (!rate || numericValue === null || numericValue === undefined || isNaN(numericValue)) {
        return null;
    }

    const formattedValue = formatToCurrency(numericValue);
    const gallons = getGallonsTranslate(Math.round(numericValue / rate).toFixed(2));

    return t('limit-in-gallons-hint', { value: formattedValue, gallons });
};

export const EditFuelCardForm = ({ formRef, onAfterSubmit }: EditFuelCardToDriverFormProps) => {
    const { initialValues, ulsdConversionRate, defConversionRate, onSubmit } = useEditFuelCardForm({ onAfterSubmit });

    return (
        <Form<EditFuelCardFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form, values: { hasLimit, limit, limitDef } }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <Field
                                render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                                    return (
                                        <NativeSwitch
                                            checked={props.input.value}
                                            onChange={event => {
                                                props.input.onChange(event);
                                            }}
                                            {...props}
                                        />
                                    );
                                }}
                                name='hasLimit'
                                label={t('enable-limit-label')}
                            />
                        </FormControl>
                        {hasLimit && (
                            <>
                                <FormControl>
                                    <InputLabel required={true}>{t('limit-label')}</InputLabel>
                                    <Field
                                        parse={value => value}
                                        name='limit'
                                        placeholder=''
                                        component={CurrencyInput}
                                        startAdornment='$'
                                        allowNegative={false}
                                        decimalScale={0}
                                        validate={requiredCurrency}
                                        hint={calculateLimitWithRate({ rate: ulsdConversionRate, value: limit })}
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('limit-def-label')}</InputLabel>
                                    <Field
                                        name='limitDef'
                                        parse={value => value}
                                        placeholder=''
                                        component={CurrencyInput}
                                        startAdornment='$'
                                        allowNegative={false}
                                        decimalScale={0}
                                        validate={requiredCurrency}
                                        hint={calculateLimitWithRate({ rate: defConversionRate, value: limitDef })}
                                    />
                                </FormControl>
                            </>
                        )}
                    </form>
                );
            }}
        />
    );
};
