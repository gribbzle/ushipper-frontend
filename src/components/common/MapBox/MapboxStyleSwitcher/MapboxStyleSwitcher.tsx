import React, { useMemo } from 'react';

import { SegmentedControl, SegmentedControlOption } from '@ui';
import { classname } from '@utils/classname';
import { translateMapBoxStyle } from '@utils/translations';

import { DEFAULT_STYLE, DEFAULT_STYLES } from './constants';

import './styles.scss';

const cn = classname('mapbox-style-switcher');

type MapboxStyleSwitcherProps = {
    onChange: (value: string) => void;
};

export const MapboxStyleSwitcher = ({ onChange }: MapboxStyleSwitcherProps): JSX.Element => {
    const mapStyleSegments = useMemo(
        (): SegmentedControlOption[] =>
            DEFAULT_STYLES.map(style => ({
                label: translateMapBoxStyle(style.key),
                value: style.uri,
            })),
        [],
    );

    const defaultIndex = useMemo((): number => DEFAULT_STYLES.findIndex(style => style.key === DEFAULT_STYLE.key), []);

    return (
        <div className={cn()}>
            <SegmentedControl
                name='map'
                segments={mapStyleSegments}
                autoWidth={true}
                defaultIndex={defaultIndex}
                callback={value => {
                    onChange?.(value as string);
                }}
            />
        </div>
    );
};
