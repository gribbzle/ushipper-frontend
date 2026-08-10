import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {SelectField} from '@/fields/select-field';
import { useGetExternalDriversQuery } from '@store/api/external-drivers-api';

export const SDDriversSelect = (props: FieldRenderProps<string[]>) => {
    const { data: externalDrivers } = useGetExternalDriversQuery();
    const options = useMemo(() => externalDrivers?.map(driver => ({ label: driver.name, value: driver.guid })), [externalDrivers]);

    return <SelectField {...props} options={options} isClearable={true} />;
};
