import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';

import { CurrencyPercentageFieldProps, HandleErrorProps } from './currency-percentage-field.types';

export const useCurrencyPercentageField = ({ fieldName, prefix, selectedValue }: Omit<CurrencyPercentageFieldProps, 'disabled'>) => {
    const [focused, setFocused] = useState<boolean>(false);
    const [errored, setErrored] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();
    const { batch, change } = useForm();

    const handleFocused = useCallback((value: boolean) => setFocused(value), []);

    const handleError = useCallback(({ errored, errorMessage }: HandleErrorProps) => {
        setErrored(errored);
        setError(errorMessage);
    }, []);

    const feeValueFieldName = useMemo(() => (prefix ? `${prefix}.${fieldName}` : fieldName), [prefix, fieldName]);
    const feeValueTypeFieldName = useMemo(() => (prefix ? `${prefix}.valueType` : 'valueType'), [prefix]);

    useEffect(() => {
        if (selectedValue) {
            batch(() => {
                change(`${feeValueFieldName}`, String(selectedValue?.defaultValue));
                change(`${feeValueTypeFieldName}`, selectedValue?.valueType);
            });
        }
    }, [change, batch, selectedValue, feeValueTypeFieldName, feeValueFieldName, prefix]);

    return { handleError, handleFocused, error, errored, focused, feeValueFieldName, feeValueTypeFieldName };
};
