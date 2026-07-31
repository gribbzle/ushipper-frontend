import React from 'react';

import { classname } from '@utils/classname';

import './form-control.scss';

const cn = classname('form-control');

type Props = {
    className?: string;
    children: React.ReactNode;
};

export const FormControl = ({ className, children }: Props) => <div className={cn('', [className])}>{children}</div>;
