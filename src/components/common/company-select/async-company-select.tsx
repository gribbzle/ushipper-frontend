import React, { useCallback, useEffect } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CompanyType } from '@/enums';
import { AsyncSelectField } from '@fields';
import { useAsyncSelect } from '@hooks';
import { GetCompaniesParams, useLazyGetCompaniesQuery, useLazyGetCompanyQuery } from '@store/api/company-api';

type CompanySelectProps = {
    callback?: (val: string | undefined) => void;
    companyType?: CompanyType;
    onlyPartnerCompanies?: boolean;
    valueField?: 'publicId' | 'name';
};

export const AsyncCompanySelect = ({
    valueField = 'publicId',
    input,
    callback,
    companyType,
    onlyPartnerCompanies = false,
    isClearable = true,
    ...rest
}: FieldRenderProps<string> & CompanySelectProps) => {
    const [getItems] = useLazyGetCompaniesQuery();
    const [getSelectedItem] = useLazyGetCompanyQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input, callback });

    const loadOptions = useCallback(
        async (value: string) => {
            const params: GetCompaniesParams = value ? { name: value } : { perPage: 20 };

            if (companyType) {
                params.type = companyType;
            }

            if (onlyPartnerCompanies) {
                params.isPartner = 1;
            }

            const res = await getItems(params).unwrap();

            return res?.data.map(item => ({ label: item.name, value: item[valueField] }));
        },
        [getItems, onlyPartnerCompanies, companyType, valueField],
    );

    const value = initialValues?.[input.name];

    /*
        Хак, который позволяет обновить значение select-а, иначе в некоторых случаях не происходит инициализация.
        В идеале нужно сделать вложенный компонент контролируемым, чтобы его состояние было напрямую связано с
        состоянием в форме.
    */
    useEffect(() => setReady(false), [setReady, value]);

    useEffect(() => {
        const loadItem = async (val?: string) => {
            try {
                if (val) {
                    let res;

                    if (valueField === 'publicId') {
                        res = await getSelectedItem(val).unwrap();
                    } else {
                        res = await getItems({ name: val }).unwrap();
                        res = res?.data[0];
                    }

                    if (res) {
                        setDefaultSelectedOption({ label: res.name, value: res[valueField] });
                    }
                }
            } catch {
            } finally {
                setReady(true);
            }
        };

        if (initialValues) {
            loadItem(input.value);
        }
    }, [input, initialValues, valueField, getSelectedItem, setReady, setDefaultSelectedOption, getItems]);

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
                    isClearable={isClearable}
                    cacheOptions={true}
                    closeMenuOnSelect={true}
                    onBlur={event => input.onBlur(event)}
                />
            )}
        </>
    );
};
