import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { IssueStatus } from '@enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:issue-status');

export const AlertStatusSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(IssueStatus).map(status => ({
        label: t(status),
        value: status,
    }));

    return <SelectField options={options} {...props} isMulti={props.isMulti} />;
};
