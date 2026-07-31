import React, { ReactNode } from 'react';
import { default as NextLink, LinkProps } from 'next/link';

import { classname } from '@utils/classname';

import './link.scss';

type Props = LinkProps & {
    children: ReactNode;
    className?: string;
    target?: string;
    rel?: string;
};

const cn = classname('link');

export const Link = ({ children, className, ...props }: Props) => (
    <NextLink scroll={true} {...props} className={cn('', [className])}>
        {children}
    </NextLink>
);
