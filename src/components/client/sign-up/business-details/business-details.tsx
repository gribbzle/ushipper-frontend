import React from 'react';
import { useFormState } from 'react-final-form';

import { Link } from '@/components/common/link/link';
import { useGetSpecializationsQuery } from '@store/api/specializations-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { CategoriesSelect } from './categories-select';
import { SpecializationSelect } from './specializations-select';

const t = (key: string) => translateByNamespace('client:sign-up-page')(`form.business-details-step.${key}`);
const cn = classname('sign-up-page');

export const BusinessDetails = () => {
    const { specializations } = useFormState().values;

    useGetSpecializationsQuery();

    return (
        <div className={cn('form-step')}>
            <h4>{t('title')}</h4>
            <p>
                {t('description')} <Link href='/'>{t('help-page')}</Link>.
            </p>
            <div className={cn('form-business-details')}>
                <SpecializationSelect />
                {specializations?.map((id: number) => (
                    <CategoriesSelect key={id} specializationId={id} />
                ))}
            </div>
        </div>
    );
};
