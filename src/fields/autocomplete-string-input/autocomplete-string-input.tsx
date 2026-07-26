import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FormControl, FormHelperText, InputLabel, NativeInputProps } from '@/fields';
import { AutocompleteInput, AutocompleteSuggestion } from '@components';
import { translateByNamespace } from '@utils';

type Props = NativeInputProps & {
    input: FieldRenderProps<string>['input'];
    meta: FieldRenderProps<string>['meta'];
    label: string;
    required?: boolean;
    suggestions: AutocompleteSuggestion[];
    automaticallyFilterSuggestions?: boolean;
    automaticallyChangeFormValueOnSelect?: boolean;
    disabled?: boolean;
    onChangeText?: (value: string) => void;
    onSelectSuggestion?: (value: AutocompleteSuggestion) => void;
};

const t = translateByNamespace('common:string-input');

export const AutocompleteStringInput = (props: Props) => {
    const {
        input,
        meta,
        label,
        required,
        className,
        onChangeText,
        onSelectSuggestion,
        suggestions,
        automaticallyFilterSuggestions,
        automaticallyChangeFormValueOnSelect = true,
        placeholder = t('placeholder'),
        disabled = false,
        ...rest
    } = props;
    const { active, touched, submitError, dirtySinceLastSubmit } = meta;
    const { name, onChange, value } = input;

    const error = meta.error || (!dirtySinceLastSubmit && submitError);
    const isErrorVisible = !active && touched && !!error;

    const handleChange = useCallback(
        (text: string) => {
            onChangeText?.(text);
            onChange(text);
        },
        [onChange, onChangeText],
    );

    const handleSelectSuggestion = useCallback(
        (value: AutocompleteSuggestion) => {
            onSelectSuggestion?.(value);
            if (automaticallyChangeFormValueOnSelect) {
                onChange(value.value);
            }
        },
        [onChange, onSelectSuggestion, automaticallyChangeFormValueOnSelect],
    );

    return (
        <FormControl className={className}>
            {label && <InputLabel required={required}>{label}</InputLabel>}
            <AutocompleteInput
                {...rest}
                disabled={disabled}
                name={name}
                suggestions={suggestions}
                automaticallyFilterSuggestions={automaticallyFilterSuggestions}
                onChangeText={handleChange}
                onSelectSuggestion={handleSelectSuggestion}
                placeholder={placeholder}
                value={value}
                errored={isErrorVisible}
            />
            {isErrorVisible && <FormHelperText error={true}>{error}</FormHelperText>}
        </FormControl>
    );
};
