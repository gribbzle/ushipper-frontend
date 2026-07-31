import React from 'react';

import { classname } from '@utils/classname';

import './input-adornment.scss';

const cn = classname('input-adornment');

type Props = {
    className?: string;
    children: React.ReactNode;
    reversePadding?: boolean;
};

export const InputAdornment = ({ className, children, reversePadding = false, ...rest }: Props) => (
    <div className={cn('wrapper', { reverse: reversePadding }, [className])} {...rest}>
        {children}
    </div>
);
