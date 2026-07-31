import React, { useCallback, useEffect, useState } from 'react';
import { FieldRenderProps, useFormState } from 'react-final-form';
import { MultiValue, SingleValue } from 'react-select';

import { UserRoleType } from '@/enums';
import { SelectOption } from '@/shared';
import { AsyncSelectField } from '@fields';
import { GetAccountsParams, useLazyGetAccountsQuery } from '@store/api/accounts-api';
import { classname } from '@utils/classname';

import { Loader } from '../../loader';

import './driver-accounts-select.scss';

const cn = classname('driver-accounts-select');

export const DriverAccountsSelect = ({ input, isClearable = true, isMulti = true, ...rest }: FieldRenderProps<string[]>) => {
    const [getItems] = useLazyGetAccountsQuery();
    const [getSelectedItems] = useLazyGetAccountsQuery();

    const loadOptions = useCallback(
        async (value: string) => {
            const params: Partial<GetAccountsParams> = value ? { name: value } : { perPage: 20 };

            const res = await getItems({ ...params, type: UserRoleType.DRIVER_OWNER }).unwrap();

            return res.data.map(driver => ({ label: driver.name, value: driver.publicId }));
        },
        [getItems],
    );

    const onChangeHandler = useCallback(
        (values: MultiValue<SelectOption<string>> | SingleValue<SelectOption<string>>) => {
            if (values) {
                if (Array.isArray(values)) {
                    input.onChange(values.map(el => el.value));
                } else {
                    input.onChange([(values as SelectOption<string>).value]);
                }
            } else {
                input.onChange([]);
            }
        },
        [input],
    );

    const [defaultSelectedOptions, setDefaultSelectedOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [selectReady, setReady] = useState(false);

    const { initialValues } = useFormState();

    const value = initialValues?.[input.name];

    /*
        Хак, который позволяет обновить значение select-а, иначе в некоторых случаях не происходит инициализация.
        В идеале нужно сделать вложенный компонент контролируемым, чтобы его состояние было напрямую связано с
        состоянием в форме.
    */
    useEffect(() => setReady(false), [setReady, value]);

    useEffect(() => {
        const loadItems = async (publicIds: string[]) => {
            try {
                if (Array.isArray(publicIds) && publicIds.length) {
                    const res = await getSelectedItems({ publicIds, type: UserRoleType.DRIVER_OWNER }).unwrap();
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

        if (Boolean(input.value)) {
            loadItems(input.value);
        }
    }, [input, getSelectedItems, selectReady]);

    if (!selectReady) {
        return (
            <div className={cn('loading')}>
                <Loader />
            </div>
        );
    }

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
                    isMulti={isMulti}
                    isClearable={isClearable}
                    cacheOptions={true}
                    closeMenuOnSelect={true}
                    onBlur={event => input.onBlur(event)}
                />
            )}
        </>
    );
};
