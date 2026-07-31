import React, { MouseEvent, ReactNode, useCallback, useState } from 'react';

import { CarrentIcon } from '@icons';
import { classname } from '@utils/classname';

import './accordion.scss';

type Props = {
    title: ReactNode;
    rightAddon?: ReactNode;
    children: ReactNode;
    opened?: boolean;
    className?: string;
    reverse?: boolean;
    carretSize?: 'large';
    onTop?: boolean;
    bottomSpacing?: number;
};

const cn = classname('accordion');

export const Accordion = (props: Props) => {
    const { children, title, rightAddon, opened = false, className, reverse = false, carretSize, onTop, bottomSpacing = 0 } = props;
    const [isOpen, setIsOpen] = useState(!opened);

    const toggleIsOpenHandler = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        },
        [isOpen],
    );

    return (
        <div className={cn('', { open: isOpen }, [className])}>
            <div className={cn('head', { reverse })} onClick={e => toggleIsOpenHandler(e)}>
                <div className={cn('head-carret', { size: carretSize, open: isOpen })}>
                    <CarrentIcon />
                </div>
                <div className={cn('head-title')}>{title}</div>
                <div className={cn('head-right-addon')}>{rightAddon}</div>
            </div>
            <div className={cn('body', { 'on-top': onTop })} style={onTop ? { bottom: `calc(100% + ${bottomSpacing}px)` } : {}}>
                <div className={cn('body-margin')}>{children}</div>
            </div>
        </div>
    );
};
