import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { VehicleType } from '@enums';
import {SelectField, SelectFieldProps} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

type Props = SelectFieldProps & {
    showOptionAll?: boolean;
    allValue?: any;
};

const t = translateByNamespace('common:vehicle-types');

export const VehicleTypesSelect = ({ displayAllOptions = true, showOptionAll, allValue, ...rest }: Props) => {
    const options = useMemo(
        () => [
            ...(showOptionAll ? [{ label: t('all'), value: allValue }] : []),
            ...Object.values(VehicleType).map(vehicleType => ({
                label: t(toKebabCase(vehicleType)),
                value: vehicleType,
            })),
        ],
        [showOptionAll, allValue],
    );

    return <SelectField {...rest} options={options} displayAllOptions={displayAllOptions} />;
};
