import React, { MutableRefObject } from 'react';
import { FormApi } from 'final-form';
import { Field, FieldRenderProps, Form } from 'react-final-form';

import { CurrencyInput, FormControl, InputLabel, NativeSwitch, NativeSwitchProps } from '@fields';
import { classname, formatToCurrency, getGallonsTranslate, translateByNamespace } from '@utils';
import { requiredCurrency } from '@validators';

import { useEditFuelCardForm } from './use-edit-fuel-card-form';

import './edit-fuel-card-form.scss';

export type EditFuelCardFormState = {
    limit?: number;
    limitDef?: number;
    hasLimit: boolean;
};

export type EditFuelCardToDriverFormProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<EditFuelCardFormState> | undefined>;
};

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
