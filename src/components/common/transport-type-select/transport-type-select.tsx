import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransportTypeEnum } from '@/enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:transport-types');

type Props = FieldRenderProps<string> & {
    label: string;
    showOptionAll?: boolean;
    valueAll?: string;
    className?: string;
};

export const TransportTypeSelect = ({ showOptionAll, valueAll, ...rest }: Props) => {
    const options = useMemo(
        () => [
            ...(showOptionAll ? [{ value: valueAll, label: t('all') }] : []),
            ...Object.values(TransportTypeEnum).map(type => ({
                label: t(type),
                value: type,
            })),
        ],
        [showOptionAll, valueAll],
    );

    return <SelectField {...rest} options={options} />;
};
