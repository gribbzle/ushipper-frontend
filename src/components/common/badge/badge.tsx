import React, { MouseEventHandler, ReactNode } from 'react';

import { classname } from '@utils';

import './badge.scss';

const cn = classname('badge');

type Props = {
    className?: string;
    variant?: 'dot';
    color?: 'default' | 'danger' | 'success' | 'primary';
    children?: ReactNode;
    badgeContent?: number;
    showZero?: boolean;
    size?: 'default' | 'mini';
    withBorder?: boolean;
    isBadgeContentDanger?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
};

export const Badge = ({
    className,
    variant,
    color = 'default',
    children,
    badgeContent,
    showZero = false,
    size = 'default',
    withBorder = false,
    isBadgeContentDanger = false,
    onClick,
}: Props) => {
    return (
        <div className={cn('', { 'with-border': withBorder, color }, [className])} onClick={onClick}>
            {variant === 'dot' && <span className={cn('dot', { size, color })}> </span>}
            {variant !== 'dot' && showZero && badgeContent !== undefined && (
                <div className={cn('badge-content', { danger: isBadgeContentDanger })}>{badgeContent}</div>
            )}
            {variant !== 'dot' &&
                !showZero &&
                badgeContent !== undefined &&
                badgeContent > 0 &&
                (badgeContent < 100 ? (
                    <div className={cn('badge-content', { danger: isBadgeContentDanger })}>{badgeContent}</div>
                ) : (
                    <div className={cn('badge-content', { danger: isBadgeContentDanger })}>99+</div>
                ))}
            {children}
        </div>
    );
};
