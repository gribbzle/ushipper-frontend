import React, { useRef, useState } from 'react';
import { useCallback, useMemo } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { AddressFields } from '@/components/client/company-settings/company-address-fields';
import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { Paper } from '@/components/common/paper/paper';
import parseValidationFields from '@/utils/parse-validation-fields';
import { ImageFileInput, StringInput } from '@fields';
import { useGetCompanyData, useMeCarrier } from '@hooks';
import { Company } from '@store/admin';
import { usePatchCompanyMutation } from '@store/api/company-api';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:company-settings');
const tPlaceholder = translateByNamespace('client:company-settings:fields');
const loadboardT = translateByNamespace('client:loadboard-filters');
const cn = classname('company-settings-page');

type FormType = Partial<
    Pick<Company, 'city' | 'address' | 'state' | 'zip' | 'description' | 'website' | 'mcNumber' | 'usdotNumber'> & {
        logo: string | File;
        birthYear: number | null;
    }
>;

export default function CompanyCard() {
    const isCarrier = useMeCarrier();
    const { data } = useGetCompanyData();

    const initialValues = useMemo<FormType>(() => {
        if (data) {
            const { city, address, state, zip, country, description, website, mcNumber, birthYear, usdotNumber } = data;

            return {
                city,
                address,
                state,
                zip,
                country,
                description,
                website,
                mcNumber,
                birthYear,
                usdotNumber,
                logo: data.logo?.url || '',
            };
        }

        return {};
    }, [data]);

    const [disabledSubmit, setDisabled] = useState(true);

    const [updateCompany] = usePatchCompanyMutation();
    const handleSubmit = useCallback(
        async (values: FormType) => {
            const { city, address, state, zip, description, website, mcNumber, birthYear, usdotNumber } = values;
            const newValues: FormType = {
                city: city || '',
                address: address || '',
                state: state || '',
                zip: zip || '',
                description: description || '',
                website: website || '',
                mcNumber: mcNumber || null,
                birthYear: birthYear || null,
                usdotNumber: usdotNumber || null,
            };

            if (values.logo instanceof File) {
                newValues.logo = values.logo;
            }
            if (values.logo === null) {
                newValues.logo = '';
            }
            if (data) {
                try {
                    await updateCompany({
                        companyId: data.publicId,
                        data: newValues,
                    }).unwrap();
                    setDisabled(true);
                    toast.success(t<string>('company-update-success'));
                } catch (e) {
                    return parseValidationFields(e);
                }
            }
        },
        [data, updateCompany],
    );

    const btnRef = useRef<HTMLButtonElement>(null);
    const onSubmitHandler = useCallback(() => {
        if (btnRef.current) {
            btnRef.current.click();
        }
    }, []);
    const formRef = useRef<FormApi<FormType>>();

    const onChangeHandler = () => {
        if (formRef.current) {
            setDisabled(!Object.keys(formRef.current.getState().dirtyFields).length);
        }
    };

    return (
        <Paper
            title={t(`${isCarrier ? 'carrier' : 'shipper'}-card-title`)}
            body={
                <div>
                    <div className={cn('company-card-user-info')}>
                        <div>
                            <div className={cn('info-title')}>{t(`company-card.${isCarrier ? 'c' : 's'}-role-name`)}</div>
                            <div className={cn('info-content')}>{data?.name}</div>
                        </div>
                        <div>
                            <div className={cn('info-title')}>{t('company-card.usdot-number')}</div>
                            <div className={cn('info-content')}>{data?.usdotNumber}</div>
                        </div>
                    </div>
                    <Divider>{t('divider-address')}</Divider>
                    <Form
                        subscription={{ values: true }}
                        onSubmit={handleSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, form }) => {
                            formRef.current = form;

                            return (
                                <form className={cn('form')} onSubmit={handleSubmit}>
                                    <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                                    <div className={cn('form-address-block')}>
                                        <AddressFields />
                                        {/*<Field*/}
                                        {/*    className={cn('country-field')}*/}
                                        {/*    name='country'*/}
                                        {/*    component={StringInput}*/}
                                        {/*    label={t('fields:country')}*/}
                                        {/*    required={false}*/}
                                        {/*placeholder={tPlaceholder('no-placeholder')}*/}
                                        {/*/>*/}
                                    </div>
                                    <Divider>{t('divider-about')}</Divider>
                                    <div className={cn('form-about-block')}>
                                        <Field name='logo' component={ImageFileInput} fileEntity={t('logo')} />
                                        <Field
                                            name='description'
                                            label={t('divider-about')}
                                            component={StringInput}
                                            textarea={true}
                                            resize='none'
                                            placeholder={tPlaceholder('no-placeholder')}
                                        />
                                        <Field
                                            name='website'
                                            label={t('fields:website')}
                                            component={StringInput}
                                            placeholder={tPlaceholder('no-placeholder')}
                                        />
                                        <div className={cn('row-fields')}>
                                            <Field
                                                name='mcNumber'
                                                label={t('fields:mcNumber')}
                                                component={StringInput}
                                                placeholder={tPlaceholder('no-placeholder')}
                                            />
                                            <Field
                                                name='birthYear'
                                                label={t('fields:birthYear')}
                                                component={StringInput}
                                                type='number'
                                                placeholder={tPlaceholder('no-placeholder')}
                                            />
                                        </div>
                                    </div>
                                    <button ref={btnRef} type='submit' className={cn('invisible')} />
                                </form>
                            );
                        }}
                    />
                </div>
            }
            footer={
                <div>
                    <Button disabled={disabledSubmit} view='primary' onClick={onSubmitHandler}>
                        {loadboardT('save')}
                    </Button>
                </div>
            }
        />
    );
}
