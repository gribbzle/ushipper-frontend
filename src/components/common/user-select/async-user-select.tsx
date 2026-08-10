import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {AsyncSelectField} from '@/fields/select-field';
import { useAsyncSelect } from '@/hooks/selects/use-async-select';
import { useLazyGetUserQuery, useLazyGetUsersQuery } from '@store/api/users-api';

type AsyncUserSelectProps = {
    companyName?: string;
    superiorsForRoleId?: number;
    companyId?: string;
    hideUserOwnerOption?: boolean;
};

export const AsyncUserSelect = ({
    input,
    companyName,
    superiorsForRoleId,
    companyId,
    hideUserOwnerOption = false,
    isClearable = true,
    ...rest
}: FieldRenderProps<string> & AsyncUserSelectProps) => {
    const [getItems] = useLazyGetUsersQuery();
    const [getSelectedItem] = useLazyGetUserQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input });
    const [selectKey, setSelectKey] = useState(0);

    const loadOptions = useCallback(
        async (value: string) => {
            const params = value ? { name: value } : { perPage: 20 };
            const res = await getItems({ ...params, companyName, superiorsForRoleId, companyId }).unwrap();

            return res.data.filter(item => !(hideUserOwnerOption && item.roleType.includes('owner'))).map(item => ({ label: item.name, value: item.publicId }));
        },
        [getItems, hideUserOwnerOption, companyName, superiorsForRoleId, companyId],
    );

    useEffect(() => {
        const loadItem = async (id?: string) => {
            try {
                if (id) {
                    const res = await getSelectedItem({ id }).unwrap();

                    setDefaultSelectedOption({ label: res.name, value: res.publicId });
                }
            } catch {
            } finally {
                setReady(true);
            }
        };

        if (initialValues) {
            loadItem(input.value);
        }
    }, [input, initialValues, getSelectedItem, setReady, setDefaultSelectedOption]);

    const errored = useMemo(() => rest.meta.error && rest.meta.touched, [rest.meta.error, rest.meta.touched]);

    useEffect(() => {
        if (selectReady) {
            setSelectKey(prevKey => prevKey + 1);
        }
    }, [selectReady, companyId, superiorsForRoleId]);

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    key={selectKey}
                    {...rest}
                    onChange={onChangeHandler}
                    defaultOptions={rest.disabled ? false : true}
                    defaultValue={defaultSelectedOption}
                    loadOptions={loadOptions}
                    isSearchable={true}
                    isMulti={false}
                    isClearable={isClearable}
                    cacheOptions={true}
                    closeMenuOnSelect={true}
                    onBlur={event => input.onBlur(event)}
                    errored={errored}
                    errorText={rest.meta.error || rest.meta.submitError}
                />
            )}
        </>
    );
};
