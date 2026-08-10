import { MaskProps } from '@react-input/mask';
import React from 'react';
import { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {TextField} from '@/fields/text-field';
const MASK_VALUE = 'X-XXXXXXX';

export const IdentificationNumberInput = (props: FieldRenderProps<string>) => {
    const mask = useMemo<MaskProps>(() => ({ mask: MASK_VALUE, replacement: { X: /\d/ } }), []);

    return <TextField {...props} mask={mask} placeholder={MASK_VALUE} />;
};
