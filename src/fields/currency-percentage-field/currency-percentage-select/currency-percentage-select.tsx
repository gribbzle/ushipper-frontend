import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FeeCategoryValueType } from '@/enums';
import { SelectField } from '@/fields/select-field/select-field';
import { classname } from '@utils/classname';

import './currency-percentage-select.scss';

const cn = classname('currency-percentage-select');

export const CurrencyPercentageSelect = (props: FieldRenderProps<string> & { hideSelectionIndicator?: boolean }) => {
    const options = useMemo(
        () => [
            { label: '%', value: FeeCategoryValueType.PERCENT },
            { label: '$', value: FeeCategoryValueType.FIXED },
        ],
        [],
    );

    return <SelectField {...props} options={options} isClearable={false} className={`${cn('', { hide: props.hideSelectionIndicator })} ${props.className}`} />;
};
