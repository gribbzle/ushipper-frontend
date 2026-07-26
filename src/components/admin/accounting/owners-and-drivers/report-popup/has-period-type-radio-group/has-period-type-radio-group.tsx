import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { RadioOption } from '@components';
import { FormControl, RadioGroupInput } from '@fields';
import { classname, translateByNamespace } from '@utils';

import './has-period-type-radio-group.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:report-popup:form');
const cn = classname('has-period-type-radio-group');

type Props = {
    className?: string;
    name: string;
};

export const HasPeriodRadioGroup = ({ className, ...rest }: Props) => {
    const options: RadioOption[] = useMemo(
        () => [
            {
                label: t('last-cash-out-option-label'),
                value: 'last_cash_out',
            },
            {
                label: t('custom-option-label'),
                value: 'custom',
            },
        ],
        [],
    );

    return (
        <FormControl className={cn('', [className])}>
            <Field {...rest} component={RadioGroupInput} options={options} placeholder='' />
        </FormControl>
    );
};
