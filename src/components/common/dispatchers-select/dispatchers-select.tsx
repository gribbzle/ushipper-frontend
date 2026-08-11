import React, { useCallback, useEffect, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { MultiValue, SingleValue } from 'react-select';

import { SelectOption } from '@/shared/types';
import {AsyncSelectField} from '@/fields/select-field';
import { useLazyGetDispatchersQuery } from '@store/api/users-api';

export const DispatchersSelect = (props: FieldRenderProps<string[]>) => {
    const [getItems] = useLazyGetDispatchersQuery();
    const [getSelectedItems] = useLazyGetDispatchersQuery();

    const loadOptions = useCallback(
        async (value: string) => {
            const params = value ? { name: value } : { perPage: 20 };
            const res = await getItems(params).unwrap();

            return res.data.map(item => ({ label: item.name, value: item.publicId }));
        },
        [getItems],
    );

    const onChangeHandler = useCallback(
        (values: MultiValue<SelectOption<string>> | SingleValue<SelectOption<string>>) => {
            if (values) {
                if (Array.isArray(values)) {
                    props.input.onChange(values.map(el => el.value));
                } else {
                    props.input.onChange([(values as SelectOption<string>).value]);
                }
            } else {
                props.input.onChange([]);
            }
        },
        [props.input],
    );

    const [defaultSelectedOptions, setDefaultSelectedOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [selectReady, setReady] = useState(false);

    useEffect(() => {
        const loadItems = async (publicIds: string[]) => {
            try {
                if (Array.isArray(publicIds) && publicIds.length) {
                    const res = await getSelectedItems({
                        publicIds: publicIds,
                    }).unwrap();
                    const items = res?.data.map(item => ({ label: item.name, value: item.publicId }));

                    if (items) {
                        setDefaultSelectedOptions(items);
                    }
                }
            } catch {
            } finally {
                setReady(true);
            }
        };

        if (props.input.value) {
            loadItems(props.input.value);
        }
    }, [props.input, getSelectedItems, selectReady]);

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    onChange={onChangeHandler}
                    defaultOptions={true}
                    loadOptions={loadOptions}
                    defaultValue={defaultSelectedOptions}
                    isSearchable={true}
                    isMulti={props.isMulti ?? true}
                    isClearable={true}
                    cacheOptions={true}
                    closeMenuOnSelect={props.closeMenuOnSelect}
                    onBlur={(event: React.FocusEvent<HTMLElement, Element>) => props.input.onBlur(event)}
                    placeholder={props.placeholder}
                />
            )}
        </>
    );
};
