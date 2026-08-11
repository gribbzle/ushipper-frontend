import { useCallback, useState } from 'react';
import { FieldRenderProps, useFormState } from 'react-final-form';
import { SingleValue } from 'react-select';

import { SelectOption } from '@/shared/types';

export const useAsyncSelect = ({ input, callback }: { input: FieldRenderProps<string | number>['input']; callback?: (val: string | undefined) => void }) => {
    const { initialValues } = useFormState();

    const onChangeHandler = useCallback(
        (value: SingleValue<SelectOption<string | number>>) => {
            input.onChange(value?.value);
            callback?.(value?.label);
        },
        [input, callback],
    );

    const [defaultSelectedOption, setDefaultSelectedOption] = useState<SelectOption<string | number>>();
    const [selectReady, setReady] = useState(false);

    return { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues };
};
