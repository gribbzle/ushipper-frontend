import React, { useCallback, useEffect, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { MultiValue, SingleValue } from 'react-select';

import { SelectOption } from '@/shared';
import { AsyncSelectField } from '@fields';
import { useLazyGetDriversQuery } from '@store/api/users-api';

type Props = FieldRenderProps<string[]> & { ownerAccountId?: string };

export const DriversSelect = ({ ownerAccountId, ...props }: Props) => {
    const [getDrivers] = useLazyGetDriversQuery();
    const [getSelectedDefaultDrivers] = useLazyGetDriversQuery();

    const loadOptions = useCallback(
        async (value: string) => {
            const params: Record<string, any> = value ? { name: value } : { perPage: 20 };

            if (ownerAccountId) {
                params.ownerAccountId = ownerAccountId;
            }

            const res = await getDrivers(params).unwrap();

            return res.data.map(driver => ({ label: driver.name, value: driver.publicId }));
        },
        [getDrivers, ownerAccountId],
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
                    const res = await getSelectedDefaultDrivers({
                        publicIds: publicIds,
                    }).unwrap();
                    const items = res?.data.map(driver => ({ label: driver.name, value: driver.publicId }));

                    if (items) {
                        setDefaultSelectedOptions(items);
                    }
                }
            } catch {
            } finally {
                setReady(true);
            }
        };

        if (Boolean(props.input.value)) {
            loadItems(props.input.value);
        }
    }, [props.input, getSelectedDefaultDrivers, selectReady]);

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    key={ownerAccountId}
                    onChange={onChangeHandler}
                    loadOptions={loadOptions}
                    defaultOptions={true}
                    defaultValue={defaultSelectedOptions}
                    isSearchable={true}
                    isMulti={props.isMulti ?? true}
                    isClearable={props.isClearable ?? false}
                    cacheOptions={true}
                    closeMenuOnSelect={props.closeMenuOnSelect}
                    onBlur={event => props.input.onBlur(event)}
                    placeholder={props.placeholder}
                />
            )}
        </>
    );
};
