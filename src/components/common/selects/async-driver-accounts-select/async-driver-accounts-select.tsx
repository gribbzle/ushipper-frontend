import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { UserRoleType } from '@/enums/user-role-type';
import {AsyncSelectField} from '@/fields/select-field';
import { useAsyncSelect } from '@/hooks/selects/use-async-select';
import { useLazyGetAccountQuery, useLazyGetAccountsQuery } from '@store/api/accounts-api';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:field');

export const AsyncDriverAccountsSelect = ({ input, meta, callback, placeholder, ...rest }: FieldRenderProps<string>) => {
    const [getItems] = useLazyGetAccountsQuery();
    const [getSelectedItem] = useLazyGetAccountQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input, callback });

    const loadOptions = useCallback(
        async (value: string) => {
            const params = value ? { name: value } : { perPage: 20 };
            const res = await getItems({ ...params, type: UserRoleType.DRIVER_OWNER }).unwrap();

            return res.data.map(item => ({ label: item.name, value: item.publicId }));
        },
        [getItems],
    );

    const value = initialValues?.[input.name];

    useEffect(() => setReady(false), [setReady, value]);

    useEffect(() => {
        const loadItem = async (accountId?: string) => {
            try {
                if (accountId) {
                    const res = await getSelectedItem(accountId).unwrap();

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

    const errored = useMemo(() => meta.error && meta.touched, [meta.error, meta.touched]);

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    {...rest}
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
                    errorText={meta.error || meta.submitError}
                    errored={errored}
                    placeholder={placeholder ?? t('all-placeholder')}
                />
            )}
        </>
    );
};
