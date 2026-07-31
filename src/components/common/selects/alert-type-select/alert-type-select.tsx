import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { IssueType } from '@enums';
import { SelectField } from '@fields';
import { translateIssueType } from '@utils/translate/issue/translate-issue-type';

export const AlertTypeSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(IssueType).map(type => ({
                label: translateIssueType(type),
                value: type,
            })),
        [],
    );

    return <SelectField options={options} {...props} isMulti={props.isMulti} />;
};
