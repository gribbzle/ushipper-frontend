import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { AddressInput, AddressValue } from '@/components/common';

type Props = FieldRenderProps<AddressValue>;

export function AddressField(props: Props) {
    const onChange = useCallback(
        (v: AddressValue) => {
            props.input.onChange(v);
        },
        [props.input],
    );

    return <AddressInput value={props.input.value} onChange={onChange} {...props} />;
}
