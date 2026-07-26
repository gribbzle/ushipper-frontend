import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CommodityPackingGroupEnum } from '@/enums';
import { SelectField } from '@fields';
import { getPackingGroupTranslate } from '@utils';

export const PackingGroupSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(CommodityPackingGroupEnum).map(group => ({
                label: getPackingGroupTranslate(group),
                value: group,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
