import React from 'react';
import { Field } from 'react-final-form';

import { OrderItemInfoColumn, ZoneButton } from '@components';
import { FileUploaderField, InputLabel } from '@fields';
import { classname } from '@utils';
import { requiredFile } from '@validators';

import { FieldOrEmptyZoneProps } from './attachments-form.types';

import './attachments-form.scss';

const cn = classname('attachments-form');

export const FieldOrEmptyZone = ({ disabled, name, label, emptyLabel, title, isMultiFiles = false, isRequired = false, className }: FieldOrEmptyZoneProps) => {
    if (disabled) {
        return <ZoneButton label={emptyLabel} onClick={() => undefined} disabled={disabled} />;
    }

    if (!!title) {
        return (
            <OrderItemInfoColumn
                title={
                    <InputLabel required={isRequired} className={cn('title')}>
                        {title}
                    </InputLabel>
                }
                className={className}
            >
                <Field name={name} component={FileUploaderField} label={label} isMultiFiles={isMultiFiles} validate={isRequired ? requiredFile : undefined} />
            </OrderItemInfoColumn>
        );
    }

    return <Field name={name} component={FileUploaderField} label={label} isMultiFiles={isMultiFiles} validate={isRequired ? requiredFile : undefined} />;
};
