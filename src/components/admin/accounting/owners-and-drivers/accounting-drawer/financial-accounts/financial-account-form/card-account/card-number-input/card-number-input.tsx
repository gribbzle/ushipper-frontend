import { MaskProps } from '@react-input/mask';
import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {TextField} from '@/fields/text-field';

export const CardNumberInput = ({ hasMask, ...props }: FieldRenderProps<string> & { hasMask: boolean }) => {
    const mask = useMemo<MaskProps>(
        () => ({
            mask: 'XXXX XXXX XXXX XXXX',
            replacement: { X: /\d/ },
        }),
        [],
    );

    return <TextField {...props} mask={hasMask ? mask : undefined} placeholder='XXXX XXXX XXXX XXXX' />;
};
