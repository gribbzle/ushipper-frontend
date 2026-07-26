import { useEffect, useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { HandleErrorProps } from '../currency-percentage-field.types';

export const useCurrencyValueInput = ({ meta, onError }: Pick<FieldRenderProps<string>, 'meta'> & { onError: (value: HandleErrorProps) => void }) => {
    const errored = useMemo<boolean>(() => (meta.error && meta.touched) || meta.submitError, [meta.error, meta.touched, meta.submitError]);
    const errorMessage = meta.error || meta.submitError;

    useEffect(() => onError({ errored, errorMessage }), [errored, errorMessage, onError]);
};
