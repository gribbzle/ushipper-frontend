import React, { useMemo } from 'react';

import { RadioOption } from '@/components/common/radio-button-group/radio-button-group';
import { InspectionType } from '@/enums/inspection-type';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {PrefixedField} from '@/fields/field-prefix';
import {RadioGroupInput} from '@/fields/radio-group-input';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

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
