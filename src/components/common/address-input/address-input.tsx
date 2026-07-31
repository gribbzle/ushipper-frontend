import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'debounce';
import { FieldRenderProps } from 'react-final-form';

import { AutocompleteInput, AutocompleteSuggestion } from '@/components/common/autocomplete-input/autocomplete-input';
import { getAddressName } from '@/utils/geocoding';
import { CoordinatesWithName } from '@store/api/loadboard-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useAddressSuggestions } from './use-address-suggestions';

import './address-input.scss';

export type AddressValue = (CoordinatesWithName & { region?: string; state?: string }) | null;

type Props = Omit<FieldRenderProps<CoordinatesWithName | null>, 'input' | 'meta'> & {
    value: CoordinatesWithName | null;
    onChange: (v: CoordinatesWithName | null) => void;
    required?: boolean;
    disabled?: boolean;
    isClearable?: boolean;
    hasRegionsSuggestions?: boolean;
};

const cn = classname('address-input');
const t = translateByNamespace('common:field');

export const isCoordinatesEqual = (first?: AddressValue, second?: AddressValue): boolean => {
    if (!first || !second) {
        return false;
    }

    return (
        first.longitude === second.longitude &&
        first.latitude === second.longitude &&
        first.name === second.name &&
        first.region === second.region &&
        first.state === second.state
    );
};

export const hasValue = (value: AddressValue): boolean => {
    return !!(((value?.latitude && value?.longitude) || value?.region || value?.state) && value.name);
};

export const AddressInput = ({ disabled, onChange, value, hasRegionsSuggestions = false }: Props) => {
    const [search, setSearch] = useState<string>();

    const { suggestions, setAddresses, findAddress } = useAddressSuggestions({ search, hasRegionsSuggestions });

    useEffect(() => {
        setSearch(value?.name ?? '');
    }, [value?.name]);

    const onSelectSuggestion = useCallback(
        (val: AutocompleteSuggestion) => {
            const { lat, long, value, region, state, address } = val;

            onChange({
                ...(region ? { region } : undefined),
                ...(state ? { state } : undefined),
                name: lat && long && address ? getAddressName(address) : value,
                latitude: lat,
                longitude: long,
            });
        },
        [onChange],
    );

    const onTextChangeHandler = useMemo(() => {
        const debouncedFindAddress = debounce((value: string) => {
            findAddress(value);
        }, 300);

        return (value: string) => {
            debouncedFindAddress(value);
            setSearch(value);
        };
    }, [findAddress]);

    useEffect(() => {
        if (!hasValue(value)) {
            setAddresses([]);
        }
    }, [value, setAddresses]);

    return (
        <AutocompleteInput
            className={cn('', { large: !hasRegionsSuggestions })}
            name=''
            disabled={disabled}
            suggestions={suggestions}
            automaticallyFilterSuggestions={false}
            onChangeText={onTextChangeHandler}
            onSelectSuggestion={onSelectSuggestion}
            placeholder={hasRegionsSuggestions ? t('state-region-placeholder') : t('address-placeholder')}
            value={search}
        />
    );
};
