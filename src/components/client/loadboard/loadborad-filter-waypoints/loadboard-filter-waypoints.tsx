import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import XCircleIcon from '@/assets/icons/x-circle-icon.svg';
import { AddressInput, AddressValue } from '@/components/common/address-input/address-input';
import { FormControl, InputLabel } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './loadboard-filter-waypoints.scss';
import Nullable = Cypress.Nullable;
import { CoordinatesWithName } from '@store/api/loadboard-api';

export type WaypointsValue = Nullable<CoordinatesWithName>;

type Props = FieldRenderProps<WaypointsValue[]>;

const cn = classname('loadboard-filter-waypoints');
const t = translateByNamespace('client:loadboard-filters');

export default function LoadboardFilterWaypoints(props: Props) {
    const parsedValues = useMemo<WaypointsValue[]>(() => {
        if (!Array.isArray(props.input.value) || props.input.value.length === 0) {
            return [
                {
                    latitude: null,
                    longitude: null,
                    name: null,
                } as unknown as CoordinatesWithName,
            ];
        }

        return props.input.value;
    }, [props.input.value]);

    const onChange = (v: AddressValue, index: number): void => {
        const newArr = [...props.input.value];

        newArr[index] = v;
        props.input.onChange(newArr);
    };

    const onAdd = (): void => {
        const newArr = [...props.input.value];

        newArr.push({
            latitude: null,
            longitude: null,
            name: null,
        } as unknown as AddressValue);
        props.input.onChange(newArr);
    };

    const onRemove = (index: number): void => {
        const newArr = [...props.input.value];

        newArr.splice(index, 1);
        props.input.onChange(newArr);
    };

    return (
        <div className={cn()}>
            {parsedValues.map((value, index) => (
                <div key={index} className={cn('row')}>
                    <FormControl className={cn('form-control')}>
                        <InputLabel>
                            {t('waypoint')} {index > 0 ? index : ''}
                        </InputLabel>
                        <AddressInput value={value} onChange={v => onChange(v, index)} isClearable={props.input.value?.length === 1} />
                    </FormControl>
                    {props.input.value?.length > 1 && (
                        <button type='button' className={cn('remove-button')} onClick={() => onRemove(index)}>
                            <XCircleIcon />
                        </button>
                    )}
                </div>
            ))}
            {parsedValues.at(-1)?.name && (
                <button type='button' className={cn('add-button')} onClick={onAdd}>
                    + {t('add-waypoint')}
                </button>
            )}
        </div>
    );
}
