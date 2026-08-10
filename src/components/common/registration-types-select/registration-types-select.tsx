import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { RegistrationType } from '@/enums/registration-type';
import { translateRegistrationType } from '@/utils/translations';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:registration-types');

export const RegistrationTypesSelect = ({ allOptions, ...props }: FieldRenderProps<string> & { allOptions: boolean }) => {
    const options = useMemo(
        () =>
            Object.values(RegistrationType)
                .filter(type => allOptions || type !== RegistrationType.USDOT_CONFIRMATION)
                .map(type => ({
                    label: type === RegistrationType.USDOT_CONFIRMATION && allOptions ? t('usdot-email-confirmation') : translateRegistrationType(type),
                    value: type,
                })),
        [allOptions],
    );

    return <SelectField {...props} options={options} />;
};
