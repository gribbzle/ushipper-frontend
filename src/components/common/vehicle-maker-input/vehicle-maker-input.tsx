import React, { useMemo, useState } from 'react';
import { debounce } from 'debounce';
import { Field, FieldRenderProps } from 'react-final-form';

import { AutocompleteSuggestion } from '@/components/common/autocomplete-input/autocomplete-input';
import {AutocompleteStringInput} from '@/fields/autocomplete-string-input';
import { useGetCarMakersByNameQuery } from '@store/api/car-makers-api';

type Props = FieldRenderProps<string> & {
    disabled?: boolean;
    placeholder?: string;
};

export const VehicleMakerInput = (props: Props) => {
    const [maker, setMaker] = useState<string | null>(null);
    const { data: makers = [] } = useGetCarMakersByNameQuery(maker);
    const suggestions = useMemo<Array<AutocompleteSuggestion>>(
        () =>
            makers.map(maker => ({
                value: maker.name,
            })),
        [makers],
    );
    const handleChangeText = useMemo(() => debounce((value: string) => setMaker(value), 300), []);

    return (
        <Field
            component={AutocompleteStringInput}
            disabled={props.disabled}
            suggestions={suggestions}
            onChangeText={handleChangeText}
            automaticallyFilterSuggestions={false}
            input={props.input}
            meta={props.meta}
            name={props.input.name}
            placeholder={props.placeholder}
        />
    );
};
