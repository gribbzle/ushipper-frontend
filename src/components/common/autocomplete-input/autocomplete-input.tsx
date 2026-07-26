import React, { useCallback, useMemo, useRef, useState } from 'react';

import useOutsideCLick from '@/hooks/use-outside-cLick';
import { NativeInput, NativeInputProps } from '@fields';
import { classname } from '@utils';

import './autocomplete-input.scss';

export type AutocompleteSuggestion = {
    value: string;
    divider?: boolean;
    description?: string;
    [key: string]: any;
};
export type AutocompleteInputProps = NativeInputProps & {
    className?: string;
    suggestions: Array<AutocompleteSuggestion>;
    /**
     * Wether autocomplete component filters suggestions based on the input value?
     */
    automaticallyFilterSuggestions?: boolean;
    value?: string;
    onChangeText?: (value: string) => void;
    onSelectSuggestion?: (value: AutocompleteSuggestion) => void;
};

const cn = classname('autocomplete-input');

export const AutocompleteInput = ({
    className,
    suggestions,
    onChangeText,
    onSelectSuggestion,
    automaticallyFilterSuggestions = true,
    value,
    ...rest
}: AutocompleteInputProps) => {
    const [inputValue, setInputValue] = useState(value?.toString() || '');
    const [areSuggestionsOpen, setAreSuggestionsOpen] = useState(false);

    const ref = useRef<HTMLInputElement>(null);
    const clickOutsideHandler = useCallback(
        (outside: boolean) => {
            if (outside && areSuggestionsOpen) {
                setAreSuggestionsOpen(false);
            }
        },
        [areSuggestionsOpen],
    );

    useOutsideCLick(ref, clickOutsideHandler);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const text = e.target.value;

            setInputValue(text);
            setAreSuggestionsOpen(!!text);
            onChangeText?.(text);
        },
        [onChangeText],
    );

    const handleSuggestionClick = useCallback(
        (suggestion: AutocompleteSuggestion) => {
            setInputValue(suggestion.value);
            setAreSuggestionsOpen(false);
            onSelectSuggestion?.(suggestion);
        },
        [onSelectSuggestion],
    );

    const filteredSuggestions = useMemo(
        () =>
            automaticallyFilterSuggestions ? suggestions.filter(suggestion => suggestion.value.toLowerCase().includes(inputValue.toLowerCase())) : suggestions,
        [inputValue, automaticallyFilterSuggestions, suggestions],
    );
    const hasSuggestions = filteredSuggestions.length > 0;

    return (
        <div className={cn('', [className])}>
            <NativeInput itemID='browsers' value={value ?? inputValue} onChange={handleChange} {...rest} />
            {areSuggestionsOpen && hasSuggestions && (
                <div className={cn('suggestions-container')} ref={ref}>
                    {filteredSuggestions.map(suggestion =>
                        suggestion.divider ? (
                            <div key={suggestion.value} className={cn('divider')}>
                                {suggestion.value}
                            </div>
                        ) : (
                            <div tabIndex={0} key={suggestion.value} className={cn('suggestion')} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion.value} {suggestion.description && <>({suggestion.description})</>}
                            </div>
                        ),
                    )}
                </div>
            )}
        </div>
    );
};
