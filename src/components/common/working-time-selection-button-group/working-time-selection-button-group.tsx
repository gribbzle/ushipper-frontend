import React, { useMemo } from 'react';
import { FieldValidator } from 'final-form';
import { Field } from 'react-final-form';

import { TimeCondition } from '@/enums';
import { SelectionButtonOption } from '@components';
import { SelectionButtonGroupInput } from '@fields';
import { getWorkingTimeTranslate } from '@utils';

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
