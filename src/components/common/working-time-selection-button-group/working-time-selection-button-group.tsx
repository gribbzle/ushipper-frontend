import React, { useMemo } from 'react';
import { FieldValidator } from 'final-form';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { TimeCondition } from '@/enums';
import { SelectionButtonGroupInput } from '@/fields/selection-button-group-input/selection-button-group-input';
import { getWorkingTimeTranslate } from '@utils/get-working-time-translate';

type Props = {
    name: string;
    validate?: FieldValidator<string>;
};

export const WorkingTimeSelectionButtonGroup = ({ ...rest }: Props) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            Object.values(TimeCondition).map(timeCondition => ({
                label: getWorkingTimeTranslate(timeCondition),
                value: timeCondition,
            })),
        [],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
