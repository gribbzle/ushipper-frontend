import React from 'react';

import { classname } from '@utils/classname';

import './form-helper-text.scss';

const cn = classname('form-helper-text');

type Props = {
    className?: string;
    children: React.ReactNode;
    error?: boolean;
};

export const FormHelperText = ({ className, children, error = false }: Props) => <span className={cn('', { error }, [className])}>{children}</span>;
