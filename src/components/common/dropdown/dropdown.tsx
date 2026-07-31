import React, { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'debounce';

import useOutsideCLick from '@/hooks/use-outside-cLick';
import { classname } from '@utils/classname';

import { Divider } from '../divider';

import './dropdown.scss';

export type DropdownOption = {
    label: string;
    onClick: () => void;
    /**
     * Will be shown if not specified
     */
    show?: boolean;
};

export type DropdownDividerOption = {
    divider: boolean;
    show?: boolean;
};

export type DropdownProps = {
    children: React.ReactNode;
    menuComponent?: React.ReactNode;
    renderMenuComponent?: (isOpen: boolean) => React.ReactNode;
    trigger?: 'click' | 'hover';
    closeAfterSelecting?: boolean;
    dataTestId?: string;
    options?: Array<DropdownOption | DropdownDividerOption>;
    offset?: number;
    className?: string;
    disabled?: boolean;
    hoverDelay?: number;
    optionsClassName?: string;
};

const DEFAULT_OFFSET = 4;

const cn = classname('dropdown');

export const isDividerOption = (option: DropdownOption | DropdownDividerOption): option is DropdownDividerOption => {
    return 'divider' in option;
};

export const Dropdown = (props: DropdownProps) => {
    const {
        children,
        options,
        dataTestId,
        offset = DEFAULT_OFFSET,
        className,
        menuComponent,
        trigger = 'click',
        disabled = false,
        renderMenuComponent,
        hoverDelay,
        optionsClassName,
    } = props;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const [targetHeight, setTargetHeight] = useState<number>(0);

    useEffect(() => {
        if (ref.current) {
            setTargetHeight(ref.current.offsetHeight);
        }
    }, []);

    const clickOutsideHandler = useCallback(
        (outside: boolean) => {
            if (outside && isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        },
        [isDropdownOpen],
    );

    useOutsideCLick(ref, clickOutsideHandler);

    const toggleVisibility = useCallback(
        (e: MouseEvent) => {
            if (trigger === 'click') {
                e.stopPropagation();

                setIsDropdownOpen(!isDropdownOpen);
            }
        },
        [isDropdownOpen, setIsDropdownOpen, trigger],
    );

    const visibilityOnHover = useCallback(() => {
        if (trigger === 'hover') {
            setIsDropdownOpen(true);
        }
    }, [setIsDropdownOpen, trigger]);

    const closeDropdownOnLeave = useMemo(
        () =>
            debounce(() => {
                if (trigger === 'hover') {
                    setIsDropdownOpen(false);
                }
            }, hoverDelay),
        [hoverDelay, trigger],
    );

    const menu = useMemo(
        () => (
            <>
                {!disabled && (
                    <div
                        style={{ top: targetHeight + offset }}
                        className={cn('options', { open: isDropdownOpen }, [optionsClassName])}
                        onClick={toggleVisibility}
                    >
                        {menuComponent ||
                            (options || []).map((option, index) => {
                                if (option.show === false) {
                                    return null;
                                }

                                if (isDividerOption(option)) {
                                    return <Divider key={index} className={cn('divider')} />;
                                }

                                const { label, onClick } = option;

                                return (
                                    <div key={index} className={cn('option')} onClick={onClick}>
                                        {label}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </>
        ),
        [disabled, offset, targetHeight, isDropdownOpen, optionsClassName, toggleVisibility, menuComponent, options],
    );

    return (
        <div className={cn('', [className])} ref={ref} data-test-id={dataTestId} onMouseEnter={visibilityOnHover} onMouseLeave={closeDropdownOnLeave}>
            <div className={cn('control', { disabled })} onClick={toggleVisibility}>
                {children}
            </div>
            {renderMenuComponent ? renderMenuComponent(isDropdownOpen) : menu}
        </div>
    );
};
