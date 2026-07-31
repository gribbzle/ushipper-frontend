import {
    FloatingNode,
    FloatingPortal,
    FloatingTree,
    offset as floatingOffset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import React, { MouseEvent, useCallback, useEffect, useId, useMemo, useState } from 'react';

import { classname } from '@utils/classname';

import { Divider } from '../divider';

import { DropdownProps, isDividerOption } from './dropdown';

import './dropdown.scss';

type FloatingDropdownProps = DropdownProps;

const DEFAULT_OFFSET = 4;

const cn = classname('dropdown');

export const FloatingDropdown = (props: FloatingDropdownProps) => {
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
        hoverDelay = 200,
        optionsClassName,
    } = props;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { x, y, refs, context, update } = useFloating({
        open: isDropdownOpen,
        onOpenChange: setIsDropdownOpen,
        middleware: [
            floatingOffset(offset),
            shift({
                crossAxis: true,
            }),
        ],
        placement: 'bottom-end',
    });

    const click = useClick(context, { enabled: trigger === 'click' });
    const dismiss = useDismiss(context, {
        outsidePress: true,
        escapeKey: true,
        ancestorScroll: true,
    });
    const role = useRole(context, { role: 'menu' });
    const hover = useHover(context, {
        move: false,
        enabled: trigger === 'hover',
        delay: { open: hoverDelay, close: hoverDelay },
    });
    const focus = useFocus(context, {
        enabled: trigger === 'hover',
    });

    const handleResize = useCallback(() => update(), [update]);

    useEffect(() => {
        if (!isDropdownOpen) {
            return;
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isDropdownOpen, handleResize]);

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role]);
    const menu = useMemo(() => {
        if (disabled || !isDropdownOpen) return null;

        return (
            <FloatingPortal>
                <div
                    ref={refs.setFloating}
                    style={{ top: y, left: x }}
                    className={cn('options', { open: isDropdownOpen }, [optionsClassName])}
                    {...getFloatingProps({
                        onClick: e => {
                            e.stopPropagation();
                        },
                    })}
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
                                <div
                                    key={index}
                                    className={cn('option')}
                                    onClick={() => {
                                        onClick();
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {label}
                                </div>
                            );
                        })}
                </div>
            </FloatingPortal>
        );
    }, [disabled, isDropdownOpen, refs.setFloating, y, x, optionsClassName, getFloatingProps, menuComponent, options]);

    const id = useId();

    const toggleVisibility = useCallback(
        (e: MouseEvent) => {
            if (trigger === 'click') {
                e.stopPropagation();

                setIsDropdownOpen(!isDropdownOpen);
            }
        },
        [isDropdownOpen, setIsDropdownOpen, trigger],
    );

    return (
        <FloatingTree>
            <FloatingNode id={id}>
                <div data-test-id={dataTestId} className={cn('', [className])} onClick={toggleVisibility}>
                    <div
                        ref={refs.setReference}
                        className={cn('control', { disabled })}
                        {...getReferenceProps({
                            onClick: e => {
                                e.stopPropagation();
                            },
                        })}
                    >
                        {children}
                    </div>
                    {renderMenuComponent ? renderMenuComponent(isDropdownOpen) : menu}
                </div>
            </FloatingNode>
        </FloatingTree>
    );
};
