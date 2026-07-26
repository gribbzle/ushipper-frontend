import React, { MouseEventHandler, useCallback, useEffect } from 'react';

import { classname } from '@utils';

import './popup.scss';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
    isClickOutside?: boolean;
    onTop?: boolean;
    size?: 'default' | 'medium' | 'large';
};

const cn = classname('popup');

export const Popup = (props: Props) => {
    const { title, description, actions, isOpen, className, onClose, isClickOutside = true, onTop = false, size = 'default' } = props;

    const onClickOutsideModal: MouseEventHandler<HTMLDivElement> = useCallback(
        event => {
            if (!isClickOutside) {
                return;
            }

            const target = event.target as HTMLElement;

            if (target.classList.contains(cn('container'))) {
                onClose();
            }
        },
        [onClose, isClickOutside],
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

    if (!isOpen) {
        return null;
    }

    return (
        <div className={cn('container', { 'on-top': onTop })} onClick={onClickOutsideModal}>
            <div className={cn('', { size }, [className])}>
                <div className={cn('title')}>{title}</div>
                {description && <div className={cn('description')}>{description}</div>}
                {actions && <div className={cn('actions')}>{actions}</div>}
            </div>
        </div>
    );
};
