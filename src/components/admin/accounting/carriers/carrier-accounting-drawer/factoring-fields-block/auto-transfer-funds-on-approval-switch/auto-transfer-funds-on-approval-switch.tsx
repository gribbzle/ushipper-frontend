import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import {FormControl} from '@/fields/form-control';
import {NativeSwitch, NativeSwitchProps} from '@/fields/switch-input';
import {PrefixedField} from '@/fields/field-prefix';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:factoring');

export const AutoTransferFundsOnApprovalSwitch = () => (
    <FormControl>
        <PrefixedField
            render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                return <NativeSwitch checked={props.input.value} onChange={event => props.input.onChange(event)} {...props} />;
            }}
            name='autoTransferFundsOnApproval'
            label={t('auto-transfer-funds-on-approval')}
        />
    </FormControl>
);
