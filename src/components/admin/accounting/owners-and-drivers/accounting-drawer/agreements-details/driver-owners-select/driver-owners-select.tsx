import React, { useCallback, useEffect } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { UserRoleType } from '@/enums/user-role-type';
import {AsyncSelectField} from '@/fields/select-field';
import { useAsyncSelect } from '@hooks';
import { useLazyGetAccountQuery, useLazyGetAccountsQuery } from '@store/api/accounts-api';

export const DriverOwnersSelect = ({ input, excludedDriverId, disabled }: FieldRenderProps<string> & { excludedDriverId: string }) => {
    const [getItems] = useLazyGetAccountsQuery();
    const [getSelectedItem] = useLazyGetAccountQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input });

    const loadOptions = useCallback(
        async (value: string) => {
            const params = value ? { name: value } : { perPage: 20 };
            const res = await getItems({ ...params, type: UserRoleType.DRIVER_OWNER, parentId: '' }).unwrap();

            return res.data.filter(item => item.publicId !== excludedDriverId).map(item => ({ label: item.name, value: item.publicId }));
        },
        [getItems, excludedDriverId],
    );

    const value = initialValues?.[input.name];

    /*
        Хак, который позволяет обновить значение select-а, иначе в некоторых случаях не происходит инициализация.
        В идеале нужно сделать вложенный компонент контролируемым, чтобы его состояние было напрямую связано с
        состоянием в форме.
    */
    useEffect(() => setReady(false), [setReady, value]);

    const loadItem = useCallback(
        async (parentId: string) => {
            try {
                const res = await getSelectedItem(parentId).unwrap();

                const defaultOption = res ? { label: res.name, value: res.publicId } : undefined;

                setDefaultSelectedOption(defaultOption);
            } catch {
            } finally {
                setReady(true);
            }
        },
        [getSelectedItem, setReady, setDefaultSelectedOption],
    );

    useEffect(() => {
        if (input.value) {
            loadItem(input.value);
        } else {
            setReady(true);
        }
    }, [input.value, loadItem, setReady]);

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    disabled={disabled}
                    onChange={onChangeHandler}
                    defaultOptions={true}
                    defaultValue={defaultSelectedOption}
                    loadOptions={loadOptions}
                    isSearchable={true}
                    isMulti={false}
                    isClearable={true}
                    cacheOptions={true}
                    closeMenuOnSelect={true}
                    onBlur={event => input.onBlur(event)}
                />
            )}
        </>
    );
};
