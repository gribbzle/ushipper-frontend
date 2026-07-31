import React, { ReactNode, RefObject } from 'react';
import has from 'has-values';

import { classname } from '@utils/classname';

import './paper.scss';

type Props = {
    className?: string;
    title?: string;
    actions?: ReactNode;
    header?: ReactNode;
    headerClassName?: string;
    counter?: number;
    body?: ReactNode;
    bodyClassName?: string;
    footer?: ReactNode;
    footerClassName?: string;
    paperRef?: RefObject<HTMLInputElement>;
    theme?: 'light' | 'dark' | 'gray';
};

const cn = classname('paper');

export const Paper = ({
    title,
    actions,
    body,
    footer,
    className,
    counter,
    header,
    bodyClassName,
    headerClassName,
    footerClassName,
    paperRef,
    theme = 'light',
    ...rest
}: Props) => (
    <div ref={paperRef} className={cn('', { [theme]: true }, [className])} {...rest}>
        {(header || title) && (
            <div className={cn('header', [headerClassName])}>
                {title && (
                    <div className={cn('title-container')}>
                        <span className={cn('title')}>{title}</span>
                        {has(counter) && <span className={cn('counter')}>{counter}</span>}
                    </div>
                )}
                {header}
                {actions}
            </div>
        )}
        <div className={cn('body', [bodyClassName])}>{body}</div>
        {footer && <div className={cn('footer', [footerClassName])}>{footer}</div>}
    </div>
);
