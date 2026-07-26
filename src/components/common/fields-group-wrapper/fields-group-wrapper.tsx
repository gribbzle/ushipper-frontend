import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './fields-group-wrapper.scss';

type FieldsGroupWrapperProps = {
    children: ReactNode;
    actions?: ReactNode;
    title: string;
};

const cn = classname('fields-group-wrapper');

export const FieldsGroupWrapper = ({ children, title, actions }: FieldsGroupWrapperProps) => (
    <div className={cn('')}>
        <span className={cn('title')}>{title}</span>
        <div className={cn('row')}>{children}</div>
        {actions}
    </div>
);
