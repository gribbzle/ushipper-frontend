import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import './divider.scss';

type Props = {
    children?: ReactNode;
    className?: string;
    textAlign?: 'default' | 'left' | 'center' | 'right';
    orientation?: 'vertical' | 'horizontal';
    lineStyle?: 'solid' | 'dashed';
};

const cn = classname('divider');

export const Divider = (props: Props) => {
    const { children, className, textAlign = 'default', orientation = 'horizontal', lineStyle = 'solid' } = props;

    return <div className={cn('', { textAlign, orientation, lineStyle }, [className])}>{children && <span className={cn('wrapper')}>{children}</span>}</div>;
};
