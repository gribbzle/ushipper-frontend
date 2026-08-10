import { MaskProps } from '@react-input/mask';
import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {TextField} from '@/fields/text-field';

export const ExpiryInput = (props: FieldRenderProps<string>) => {
    const mask = useMemo<MaskProps>(() => ({ mask: 'XX/XXXX', replacement: { X: /\d/ } }), []);

    return <TextField {...props} mask={mask} placeholder='MM/YYYY' />;
};
