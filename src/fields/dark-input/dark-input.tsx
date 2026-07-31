import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { classname } from '@utils/classname';

import { TextField } from '../text-field';

import './dark-input.scss';

const cn = classname('dark-input');

export const DarkInput = ({ view = 'gray', ...props }: FieldRenderProps<string> & { view?: 'gray' | 'blue' }) => {
    return (
        <div className={cn('', { [view]: true })}>
            <TextField {...props} />
        </div>
    );
};
