import React, { useMemo } from 'react';

import { InspectionType } from '@/enums';
import { RadioOption } from '@components';
import { FormControl, InputLabel, PrefixedField, RadioGroupInput } from '@fields';
import { classname, translateByNamespace } from '@utils';

import './inspection-type-radio-group.scss';

const t = translateByNamespace('common:inspections-type');
const cn = classname('inspection-type-radio-group');

type Props = {
    className?: string;
    label: string;
    name: string;
    disabled?: boolean;
};

export const InspectionTypeRadioGroup = ({ label, className, ...rest }: Props) => {
    const options: RadioOption[] = useMemo(
        () => [
            {
                label: t('standart-option-label'),
                description: t('standart-option-description'),
                value: InspectionType.STANDART,
            },
            {
                label: t('advanced-option-label'),
                description: t('advanced-option-description'),
                value: InspectionType.ADVANCED,
            },
        ],
        [],
    );

    return (
        <FormControl className={cn('', [className])}>
            <InputLabel>{label}</InputLabel>
            <PrefixedField {...rest} component={RadioGroupInput} options={options} />
        </FormControl>
    );
};
