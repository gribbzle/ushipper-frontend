import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { AsyncSelectField } from '@fields';
import { useAsyncSelect } from '@hooks';
import { useLazyGetFuelCardQuery, useLazyGetFuelCardsQuery } from '@store/api/fuel-cards-api';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:field');

export const AsyncFuelCardsSelect = ({
    input,
    meta,
    filterUnlinkedOnly = false,
    callback,
    placeholder,
    ...rest
}: FieldRenderProps<number> & { filterUnlinkedOnly?: boolean }) => {
    const [getItems] = useLazyGetFuelCardsQuery();
    const [getSelectedItem] = useLazyGetFuelCardQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input, callback });

    const loadOptions = useCallback(
        async (value: string) => {
            const params = value ? { number: value } : { perPage: 20 };
            const res = await getItems({ ...params }).unwrap();

            return res.data.filter(item => (filterUnlinkedOnly ? !item.account : true)).map(item => ({ label: item.number, value: item.id }));
        },
        [getItems, filterUnlinkedOnly],
    );

    const value = initialValues?.[input.name];

    useEffect(() => setReady(false), [setReady, value]);

    useEffect(() => {
        const loadItem = async (fuelCardId?: number) => {
            try {
                if (fuelCardId) {
                    const res = await getSelectedItem(fuelCardId).unwrap();

                    setDefaultSelectedOption({ label: res.number, value: res.id });
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
