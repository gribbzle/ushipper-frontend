import React, { MouseEventHandler, useCallback, useEffect } from 'react';

import { classname } from '@utils/classname';

import CloseIcon from './close-icon.svg';

import './drawer.scss';

type Props = {
    isOpen: boolean;
    onTop?: boolean;
    onClose: () => void;
    className?: string;
    head: React.ReactNode;
    subhead?: React.ReactNode;
    body?: React.ReactNode;
    actionsClassName?: string;
    actions?: React.ReactNode;
    bodyCloseMode?: 'destroy-on-close' | 'just-hide-on-close';
    bodyClassName?: string;
    size?: 'small' | 'common' | 'large';
};

const cn = classname('drawer');

export const Drawer = ({
    head,
    body,
    subhead,
    actions,
    isOpen,
    onClose,
    className,
    bodyCloseMode = 'destroy-on-close',
    onTop,
    bodyClassName,
    actionsClassName,
    size = 'common',
}: Props) => {
    const onClickOutsideModal: MouseEventHandler<HTMLDivElement> = useCallback(
        event => {
            const target = event.target as HTMLElement;

            if (target.className?.includes?.(cn('container'))) {
                onClose();
            }
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            if (document.body.style.overflow !== 'hidden') {
                document.body.style.overflow = 'hidden';

                return () => {
                    document.body.style.overflow = 'auto';
                };
            }
        }
    }, [isOpen]);

    return (
        <div className={cn('container', { open: isOpen, 'on-top': onTop })} onMouseDown={onClickOutsideModal}>
            <div className={cn('', { open: isOpen, size }, [className])}>
                <div className={cn('head')}>
                    {head}
                    <div className={cn('close')} onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>
                {subhead}
                <div className={cn('body', [bodyClassName])}>
                    {((isOpen && bodyCloseMode === 'destroy-on-close') || bodyCloseMode === 'just-hide-on-close') && body}
                </div>
                {actions && <div className={cn('actions', [actionsClassName])}>{actions}</div>}
            </div>
        </div>
    );
};
