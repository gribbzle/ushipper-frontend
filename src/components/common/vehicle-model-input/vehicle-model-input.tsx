import React, { useMemo, useState } from 'react';
import { debounce } from 'debounce';
import { Field, FieldRenderProps } from 'react-final-form';

import { AutocompleteSuggestion } from '@/components/common/autocomplete-input/autocomplete-input';
import {AutocompleteStringInput} from '@/fields/autocomplete-string-input';
import { useGetCarModelsByNameQuery } from '@store/api/car-models-api';

type VehicleModelInputProps = FieldRenderProps<string> & {
    disabled?: boolean;
    placeholder?: string;
};
export const VehicleModelInput = (props: VehicleModelInputProps) => {
    const [model, setModel] = useState<string | null>(null);
    const { data: models = [] } = useGetCarModelsByNameQuery(model);
    const suggestions = useMemo<Array<AutocompleteSuggestion>>(
        () =>
            models.map(model => ({
                value: model.name,
            })),
        [models],
    );
    const handleChangeText = useMemo(() => debounce((value: string) => setModel(value), 300), []);

    return (
        <Field
            component={AutocompleteStringInput}
            suggestions={suggestions}
            onChangeText={handleChangeText}
            automaticallyFilterSuggestions={false}
            input={props.input}
            meta={props.meta}
            name={props.input.name}
            disabled={props.disabled}
            placeholder={props.placeholder}
        />
    );
};
