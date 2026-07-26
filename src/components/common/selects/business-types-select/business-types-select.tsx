import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { BusinessTypesEnum } from '@/enums';
import { SelectField } from '@fields';
import { getBusinessTypeTranslate } from '@utils';

export const BusinessTypesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(BusinessTypesEnum).map(type => ({
                label: getBusinessTypeTranslate(type),
                value: type,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
