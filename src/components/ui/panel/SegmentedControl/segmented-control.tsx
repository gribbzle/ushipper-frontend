import React, { createRef, RefObject, useEffect, useRef, useState } from 'react';

import { classname } from '@utils/classname';

import { SegmentedControlProps } from './types';

import './segmented-control.scss';

const cn = classname('segmented-control');

export const SegmentedControl = ({ name, segments, callback, defaultIndex = 0, autoWidth }: SegmentedControlProps) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const componentReady = useRef<boolean>(false);

    useEffect(() => {
        componentReady.current = true;
    }, []);

    const [refs, setRefs] = useState<Array<RefObject<HTMLDivElement>>>([]);

    const controlRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setRefs(
            segments.map(() => {
                return createRef<HTMLDivElement>();
            }),
        );
    }, [segments]);

    useEffect(() => {
        if (refs.length) {
            const activeSegmentRef = refs[activeIndex];

            if (activeSegmentRef.current && controlRef.current) {
                const { offsetWidth, offsetLeft } = activeSegmentRef.current;
                const { style } = controlRef.current;

                style.setProperty('--highlight-width', `${offsetWidth}px`);
                style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
            }
        }
    }, [refs, activeIndex, callback, controlRef, segments]);

    const onInputChange = (value: string | number, index: number) => {
        setActiveIndex(index);
        callback?.(value);
    };

    return (
        <div className={cn()} ref={controlRef}>
            <div className={cn('controls', [componentReady.current ? 'ready' : 'idle'])}>
                {segments?.map((item, i) => (
                    <div
                        key={item.value}
                        className={cn(
                            'segment',
                            {
                                'auto-w': !!autoWidth,
                            },
                            [i === activeIndex ? 'active' : 'inactive'],
                        )}
                        ref={refs[i]}
                    >
                        <input
                            type='radio'
                            value={item.value}
                            id={item.label}
                            name={name}
                            onChange={() => onInputChange(item.value, i)}
                            checked={i === activeIndex}
                        />
                        <label htmlFor={item.label}>{item.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};
