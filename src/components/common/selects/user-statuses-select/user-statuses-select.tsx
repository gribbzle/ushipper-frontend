import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';
import { useGetUserStatusesQuery } from '@store/api/user-statuses-api';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:staff-filters:user-statuses-labels');

export const UserStatusesSelect = (props: FieldRenderProps<string>) => {
    const { data: userStatuses = [], isLoading } = useGetUserStatusesQuery();

    const options = useMemo(() => userStatuses?.map(status => ({ value: status, label: t(toKebabCase(status)) })), [userStatuses]);

    return <SelectField {...props} options={options} isClearable={true} isLoading={isLoading} />;
};
