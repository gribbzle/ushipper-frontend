import React, { useCallback, useEffect, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { MultiValue } from 'react-select';

import { SelectOption } from '@/shared/types';
import {AsyncSelectField} from '@/fields/select-field';
import { useLazyGetCompaniesQuery } from '@store/api/company-api';

export const AsyncMultiCompanySelect = ({ input, isClearable = true, ...rest }: FieldRenderProps<string[]>) => {
    const [getItems] = useLazyGetCompaniesQuery();
    const [getSelectedDefaultCompanies] = useLazyGetCompaniesQuery();

    const loadOptions = useCallback(
        async (value: string) => {
            const params = value ? { name: value } : { perPage: 20 };

            const res = await getItems(params).unwrap();

            return res.data.map(company => ({ label: company.name, value: company.publicId }));
        },
        [getItems],
    );
    const onChangeHandler = useCallback(
        (values: MultiValue<SelectOption<string>>) => {
            if (values) {
                input.onChange(values.map(el => el.value));
            } else {
                input.onChange([]);
            }
        },
        [input],
    );

    const [defaultSelectedOptions, setDefaultSelectedOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [selectReady, setReady] = useState(false);

    useEffect(() => {
        const loadItems = async (publicIds: string[]) => {
            try {
                if (Array.isArray(publicIds) && publicIds.length) {
                    const res = await getSelectedDefaultCompanies({ publicIds }).unwrap();
                    const items = res?.data.map(company => ({ label: company.name, value: company.publicId }));

                    if (items) {
                        setDefaultSelectedOptions(items);
                    }
                }
            } catch {
            } finally {
                setReady(true);
            }
        };

        if (input.value) {
            loadItems(input.value);
        }
    }, [input, getSelectedDefaultCompanies, selectReady]);

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    {...rest}
                    onChange={onChangeHandler}
                    defaultOptions={true}
                    defaultValue={defaultSelectedOptions}
                    loadOptions={loadOptions}
                    isSearchable={true}
                    isMulti={true}
                    isClearable={isClearable}
                    cacheOptions={true}
                    closeMenuOnSelect={true}
                    onBlur={(event: React.FocusEvent<HTMLElement, Element>) => input.onBlur(event)}
                />
            )}
        </>
    );
};
