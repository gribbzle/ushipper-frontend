import React, { useCallback, useMemo } from 'react';
import { debounce } from 'debounce';
import has from 'has-values';
import { toCamelCase } from 'js-convert-case';
import { FormSpy } from 'react-final-form';

type FormValueSpy = <T>(props: { onChange: (values: T, touched: boolean) => void; debounceTime?: number }) => React.ReactElement;

export const FormValuesSpy: FormValueSpy = ({ onChange, debounceTime }) => {
    const onChangeDebounced = useMemo(() => (debounceTime ? debounce(onChange, debounceTime) : onChange), [debounceTime, onChange]);
    const onChangeHandler = useCallback(({ values, touched }: any) => onChangeDebounced(values, has(touched)), [onChangeDebounced]);

    return <FormSpy onChange={onChangeHandler} subscription={{ values: true, touched: true }} />;
};

export const getErrors = (result: any) => {
    const response = result.payload?.response;

    if (response?.status === 422) {
        const errorsFromResponse = response?.data?.errors || {};
        const errors = {} as any;

        Object.keys(errorsFromResponse).forEach(key => {
            errors[toCamelCase(key)] = errorsFromResponse[key][0];
        });

        return errors;
    }

    return {};
};

export const removeFieldPrefix = (values: Record<string, any>, prefix = 'field_') =>
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key.replace(new RegExp(`^${prefix}`), ''), value]));
