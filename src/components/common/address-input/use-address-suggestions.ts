import { useCallback, useMemo, useRef, useState } from 'react';

import { AutocompleteSuggestion } from '@/components/common/autocomplete-input/autocomplete-input';
import { createGeocoding, getAddressByName, getAddressName } from '@/utils/geocoding';
import { useCountriesAndStates } from '@hooks/use-countries-and-states';
import { GeocodingFeature } from '@mapbox/search-js-core';
import { useGetRegionsQuery } from '@store/api/regions-api';
import { translateByNamespace } from '@utils/i18n';

import { createDivider, createRegionSuggestion, createStateSuggestion } from './utils';

type AddressSuggestionsProps = {
    search?: string;
    hasRegionsSuggestions: boolean;
};

const t = translateByNamespace('common:field');

export const useAddressSuggestions = ({ search = '', hasRegionsSuggestions }: AddressSuggestionsProps) => {
    const [addresses, setAddresses] = useState<GeocodingFeature[]>([]);
    const geoCodingEntity = useRef(createGeocoding('place,locality,postcode'));
    const { states } = useCountriesAndStates();
    const { data: regions } = useGetRegionsQuery();

    const findAddress = useCallback((val: string) => {
        if (val) {
            getAddressByName(val, geoCodingEntity.current)
                .then(res => {
                    setAddresses(res.features);
                })
                .catch(() => {
                    setAddresses([]);
                });
        } else {
            setAddresses([]);
        }
    }, []);

    const suggestions = useMemo<Array<AutocompleteSuggestion>>(() => {
        const addressSuggestions = addresses.map(address => {
            const coords = address.geometry?.coordinates ?? [undefined, undefined];

            return {
                value: getAddressName(address),
                lat: coords[1],
                long: coords[0],
                address: address,
            };
        });

        let stateSuggestions: AutocompleteSuggestion[] = [];
        let regionSuggestions: AutocompleteSuggestion[] = [];

        if (hasRegionsSuggestions) {
            const filteredStates = states
                ?.filter(state => state.title.toLowerCase().includes(search.toLowerCase()) || state.alpha2.toLowerCase().includes(search.toLowerCase()))
                .slice(0, 5);

            const filteredRegions = regions?.filter(region => region.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

            if (filteredStates?.length) {
                stateSuggestions = [createDivider(t('states-group-label')), ...filteredStates.map(createStateSuggestion)];
            }

            if (filteredRegions?.length) {
                regionSuggestions = [createDivider(t('regions-group-label')), ...filteredRegions.map(createRegionSuggestion)];
            }
        }

        const combinedSuggestions = [...addressSuggestions, ...stateSuggestions, ...regionSuggestions];

        if (hasRegionsSuggestions && addressSuggestions.length > 0) {
            combinedSuggestions.unshift(createDivider(t('cities-group-label')));
        }

        return combinedSuggestions;
    }, [addresses, states, regions, hasRegionsSuggestions, search]);

    return { suggestions, addresses, setAddresses, findAddress };
};
