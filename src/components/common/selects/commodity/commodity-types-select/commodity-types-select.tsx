import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CommodityTypesEnum } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getCommodityTypeTranslate } from '@utils/translate/commodity/get-commodity-type-translate';

export const CommodityTypesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(CommodityTypesEnum).map(type => ({
                label: getCommodityTypeTranslate(type),
                value: type,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
