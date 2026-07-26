import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import XCircleIcon from '@/assets/icons/x-circle-icon.svg';
import { AddressInput, AddressValue, isCoordinatesEqual } from '@/components/common';
import RadiusSelect, { RADS } from '@/components/common/radius-select/radius-select';
import { FormControl, InputLabel } from '@fields';
import { CoordinatesWithRangeRegion } from '@store/api/loadboard-api';
import { classname, translateByNamespace } from '@utils';

import './loadboard-filter-location.scss';

export type LocationFilterValue = CoordinatesWithRangeRegion[];

type FormattedValue = CoordinatesWithRangeRegion;

interface Props extends FieldRenderProps<LocationFilterValue> {
    label: string;
}

const cn = classname('loadboard-filter-location');

const areValueEqual = (first?: FormattedValue, second?: FormattedValue): boolean => {
    if (first === second) {
        return true;
    }

    if (!first || !second) {
        return first === second;
    }

    return isCoordinatesEqual(first, second) && first.distance === second.distance;
};
const t = translateByNamespace('client:loadboard-filters');

export function LoadboardFilterLocation(props: Props) {
    const formattedValue = useMemo<LocationFilterValue>(() => {
        if (!Array.isArray(props.input.value) || !props.input.value.length) {
            return [
                {
                    latitude: null,
                    longitude: null,
                    distance: RADS[3],
                } as unknown as CoordinatesWithRangeRegion,
            ];
        }

        return props.input.value;
    }, [props.input.value]);

    const handleValueChange = (value: FormattedValue, index: number): void => {
        const currentValueArr = props.input.value || [];
        const currentValue = formattedValue[index];

        if (areValueEqual(currentValue, value)) {
            return;
        }

        const newValueArr = [...currentValueArr];

        newValueArr[index] = value;

        props.input.onChange(newValueArr);
    };

    const handleAddLocation = (): void => {
        const currentValueArr = props.input.value || [];
        const newValue: LocationFilterValue[number] = {
            longitude: null,
            latitude: null,
            distance: RADS[3],
        } as unknown as CoordinatesWithRangeRegion;

        props.input.onChange([...currentValueArr, newValue]);
    };

    const handleRemoveLocation = (index: number): void => {
        const newValueArr = [...props.input.value];

        if (newValueArr.length === 1) {
            const valueToClear = { ...newValueArr[0] };

            valueToClear.latitude = null as any;
            valueToClear.longitude = null as any;
            valueToClear.name = null as any;
            valueToClear.region = null as any;
            valueToClear.state = null as any;

            newValueArr[0] = valueToClear;
        } else {
            newValueArr.splice(index, 1);
        }

        props.input.onChange([...newValueArr]);
    };

    const handleUpdateRadius = (radius: number | null, index: number) => {
        const value = { ...formattedValue[index] };

        value.distance = radius ?? 0;

        handleValueChange(value, index);
    };

    const handleUpdateAddress = (value: AddressValue, index: number): void => {
        const updatedValue = { ...formattedValue[index] };

        const result = {
            ...updatedValue,
            ...value,
        };

        if (!value?.region) {
            delete result.region;
        }

        if (!value?.state) {
            delete result.state;
        }

        handleValueChange(result, index);
    };

    return (
        <div className={cn()}>
            {(formattedValue || []).map((value, index, array) => (
                <div key={index} className={cn('row')}>
                    <FormControl className={cn('coordinates')}>
                        <InputLabel>
                            {props.label} {index > 0 ? index + 1 : ''}
                        </InputLabel>
                        <AddressInput value={value} onChange={v => handleUpdateAddress(v, index)} hasRegionsSuggestions={true} />
                    </FormControl>
                    {value.name && !(value.region || value.state) && (
                        <FormControl className={cn('radius')}>
                            <InputLabel>{t('radius')}</InputLabel>
                            <RadiusSelect onChange={v => handleUpdateRadius(v, index)} value={props.input.value[index].distance} />
                        </FormControl>
                    )}
                    {(array.length > 1 || value.name) && (
                        <button type='button' className={cn('remove')} onClick={() => handleRemoveLocation(index)}>
                            <XCircleIcon />
                        </button>
                    )}
                </div>
            ))}
            {formattedValue.length > 0 && formattedValue.at(-1)?.name && (
                <div className={cn('row')}>
                    <button type='button' className={cn('button-add')} onClick={handleAddLocation}>
                        + {t('add-another-location', { location: props.label.toLowerCase() })}
                    </button>
                </div>
            )}
        </div>
    );
}
