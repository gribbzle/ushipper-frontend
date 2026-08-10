import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {SelectField} from '@/fields/select-field';
import { useMeCarrier } from '@hooks';
import { JobOffer } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:job-offers-page');

export const TypeSelect = (props: FieldRenderProps<JobOffer['type']>) => {
    const isMeCarrier = useMeCarrier();

    const options = useMemo<{ value: JobOffer['type']; label: string }[]>(
        () => [
            {
                value: isMeCarrier ? 'company_to_user' : 'user_to_company',
                label: t<string>('from-me'),
            },
            {
                value: isMeCarrier ? 'user_to_company' : 'company_to_user',
                label: t<string>('to-me'),
            },
        ],
        [isMeCarrier],
    );

    return <SelectField {...props} options={options} isClearable={false} />;
};
