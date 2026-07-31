import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { debounce } from 'debounce';
import { useForm } from 'react-final-form';

import { AutocompleteSuggestion } from '@/components/common/autocomplete-input/autocomplete-input';
import { createGeocoding, getAddressByName } from '@/utils/geocoding';
import { AutocompleteStringInput, FieldPrefixContext, TextFieldProps } from '@fields';
import { GeocodingFeature } from '@mapbox/search-js-core';
import { GeocodingFeatureContext } from '@mapbox/search-js-core/dist/geocode/types';

type Props = TextFieldProps & {
    label: string;
    required?: boolean;
    disabled?: boolean;
    searchType?: 'postcode' | string;
    isAccountAddress?: boolean;
};

const parseAddressContext = (context: GeocodingFeatureContext[]) => {
    let city, state, zipCode;

    context.forEach(contextItem => {
        const contextType = contextItem.id.split('.')[0];

        switch (contextType) {
            case 'place':
                city = contextItem.text;
                break;
            case 'region':
                let stateShortName = '';
                const shortCode = contextItem.short_code;

                if (shortCode) {
                    stateShortName = shortCode.split('-')[1];
                }
                state = stateShortName || contextItem.text;

                break;
            case 'postcode':
                zipCode = contextItem.text;
                break;
            default:
                break;
        }
    });

    return {
        city,
        state,
        zipCode,
    };
};

export default function AddressInputAutocompleteField({ searchType, isAccountAddress = false, ...props }: Props) {
    const { batch, change, blur } = useForm();
    const { prefix } = useContext(FieldPrefixContext);

    const geoCodingEntity = useRef(createGeocoding(searchType || 'address,postcode'));
    const [addresses, setAddresses] = useState<GeocodingFeature[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const findAddress = useCallback((val: string) => {
        if (val) {
            setIsLoading(true);

            getAddressByName(val, geoCodingEntity.current)
                .then(res => {
                    setAddresses(res.features);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, []);

    const onSelectSuggestion = useCallback(
        (value: AutocompleteSuggestion) => {
            const { lat, long } = value;
            const address = value.address as GeocodingFeature;

            const isAddress = address.id.startsWith('address');
            const isZip = address.id.startsWith('postcode');
            const { city, state, zipCode } = parseAddressContext(address.context);

            let streetAddress = '';
            let zip = zipCode || '';

            if (isAddress) {
                const splitPlace = address.place_name.split(', ');

                if (splitPlace.length >= 4) {
                    streetAddress = splitPlace[0];
                }
            }

            if (isZip) {
                zip = address.text;
            }

            batch(() => {
                change(`${prefix}.city`, city);
                change(`${prefix}.state`, state);

                blur(`${prefix}.city`);
                blur(`${prefix}.state`);

                if (isAccountAddress) {
                    change(`${prefix}.addressLine1`, streetAddress);
                    change(`${prefix}.addressLine2`, streetAddress);
                    change(`${prefix}.zipCode`, zip);

                    blur(`${prefix}.zipCode`);
                } else {
                    change(`${prefix}.geoLatitude`, lat);
                    change(`${prefix}.geoLongitude`, long);
                    change(`${prefix}.streetAddress`, streetAddress);
                    change(`${prefix}.zip`, zip);

                    blur(`${prefix}.zip`);
                }
            });
        },
        [prefix, isAccountAddress, batch, change, blur],
    );

    const onTextChangeHandler = useMemo(() => {
        return debounce((value: string) => {
            findAddress(value);
        }, 300);
    }, [findAddress]);

    const suggestions = useMemo<Array<AutocompleteSuggestion>>(() => {
        return addresses.map(address => {
            const center = Array.isArray(address.center) ? address.center : [undefined, undefined];

            return {
                value: searchType === 'postcode' ? address.text : address.place_name,
                lat: center[1],
                long: center[0],
                address: address,
            };
        });
    }, [addresses, searchType]);

    return (
        <AutocompleteStringInput
            {...props}
            suggestions={suggestions}
            isLoading={isLoading}
            onChangeText={onTextChangeHandler}
            onSelectSuggestion={onSelectSuggestion}
            automaticallyFilterSuggestions={false}
            automaticallyChangeFormValueOnSelect={false}
        />
    );
}
