import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import RadiusSelect from '@/components/common/radius-select/radius-select';

type Props = FieldRenderProps<number>;

export default function RadiusField(props: Props) {
    const onChange = useCallback(
        (v: number | null) => {
            props.input.onChange(v);
        },
        [props.input],
    );

    return <RadiusSelect value={props.input.value} onChange={onChange} />;
}
