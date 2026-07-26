import React, { LegacyRef, useCallback, useEffect, useRef } from 'react';
import { components, MenuListProps } from 'react-select';

import { classname, translateByNamespace } from '@utils';

import { Button } from '../../button';

import './custom-menu-list.scss';

type CustomMenuListProps = MenuListProps<any, false, any> & {
    value?: number;
    onApply: (value: number) => void;
};

const cn = classname('radius-select');
const t = translateByNamespace('client:loadboard-filters:rudius-custom-distance');
const measurementT = translateByNamespace('common:units-of-measurement');

const applyInputProgressStyles = (target?: HTMLInputElement) => {
    if (!target) {
        return;
    }
    const value = ((Number(target.value) - Number(target.min)) / (Number(target.max) - Number(target.min))) * 100;

    target.style.background =
        'linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ' +
        value +
        '%, var(--color-border-default) ' +
        value +
        '%, var(--color-border-default) 100%)';
};

/*
 * Компонент содержит очень много логики реализованной через рефы,
 * т.к. react-select содержит какую-то очень трудно обходимую логику
 * связанную с событиями внутри MenuList, что затрудняет обработку
 * элементарных событий на onChange и другие обходные решение генерируют
 * какие-то лишние рендеры из-за чего слетают значения, меню закрывается
 * без необходимости и т.д.
 */
export const CustomMenuList = (props: CustomMenuListProps) => {
    const { onApply } = props;
    const valueRef = useRef<number>(0);
    const rangeInputRef = useRef<HTMLInputElement>();
    const displayedValueRef = useRef<HTMLSpanElement>();

    const onChangeValueHandler = useCallback((event: any) => {
        if (displayedValueRef.current) {
            const value = event.target.value;

            displayedValueRef.current.innerText = measurementT('miles', { value });
            valueRef.current = Number(value);

            applyInputProgressStyles(event.target);
        }
    }, []);

    const onApplyHandler = useCallback(() => {
        onApply(valueRef.current);
    }, [onApply]);

    useEffect(() => {
        valueRef.current = props.value || 0;
        const value = props.value;

        if (displayedValueRef.current) {
            displayedValueRef.current.innerText = value ? measurementT('miles', { value }) : '';
        }
        if (rangeInputRef.current) {
            rangeInputRef.current.value = value?.toString() ?? '0';
        }

        applyInputProgressStyles(rangeInputRef.current);
    }, [props.value, rangeInputRef]);

    return (
        <components.MenuList {...props} className={cn('menu')}>
            {props.children}
            <div className={cn('custom-distance-control')}>
                <p>{t('label')}</p>
                <input
                    ref={rangeInputRef as LegacyRef<HTMLInputElement>}
                    type='range'
                    min='0'
                    max='300'
                    step='1'
                    onMouseMove={() => {
                        onChangeValueHandler({ target: rangeInputRef.current });
                    }}
                    onMouseDown={e => {
                        e.stopPropagation();
                        applyInputProgressStyles(rangeInputRef.current);
                    }}
                    onMouseUp={e => {
                        e.stopPropagation();
                        onChangeValueHandler(e);
                    }}
                    onTouchEnd={e => {
                        e.stopPropagation();
                        onChangeValueHandler(e);
                    }}
                />
                <span ref={displayedValueRef as LegacyRef<HTMLSpanElement>}></span>
                <Button view='default' size='mini' onClick={onApplyHandler}>
                    {t('apply-btn')}
                </Button>
            </div>
        </components.MenuList>
    );
};
