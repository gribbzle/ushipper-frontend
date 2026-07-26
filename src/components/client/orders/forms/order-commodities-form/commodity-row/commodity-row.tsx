import React from 'react';
import { useFormState } from 'react-final-form';

import { CommodityDimensionUnitEnum, CommodityWeightUnitEnum } from '@/enums';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { CommodityTypesSelect, FreightClassesSelect, IconButton } from '@components';
import { FieldPrefix, PrefixedField, TextField } from '@fields';
import { TrashIcon } from '@icons';
import { OrderFieldsGroup, OrderFormState } from '@store/client';
import { classname } from '@utils';

import './commodity-row.scss';

const cn = classname('commodity-row');

type Props = {
    className?: string;
    name: string;
    index: number;
    onDelete: () => void;
};

export const CommodityRow = ({ className, name, index, onDelete }: Props) => {
    const isDisabled = useDisableProductChanging();
    const formState = useFormState<OrderFormState>();
    const { weightUnit, dimensionUnit } = formState.values[OrderFieldsGroup.COMMODITIES]?.[index] || {};

    return (
        <div className={cn('', [className])}>
            <FieldPrefix prefix={name}>
                <PrefixedField disabled={isDisabled} name='description' component={TextField} placeholder='' />
                <PrefixedField disabled={isDisabled} name='quantity' component={TextField} placeholder='' type='number' />
                <PrefixedField disabled={isDisabled} name='type' component={CommodityTypesSelect} placeholder='' />
                <PrefixedField
                    disabled={isDisabled}
                    name='weight'
                    component={TextField}
                    placeholder=''
                    type='number'
                    endAdornment={weightUnit ?? CommodityWeightUnitEnum.POUNDS}
                />
                <PrefixedField disabled={isDisabled} name='pieces' component={TextField} placeholder='' type='number' />
                <PrefixedField
                    disabled={isDisabled}
                    name='length'
                    component={TextField}
                    placeholder=''
                    type='number'
                    endAdornment={dimensionUnit ?? CommodityDimensionUnitEnum.INCHES}
                />
                <PrefixedField
                    disabled={isDisabled}
                    name='width'
                    component={TextField}
                    placeholder=''
                    type='number'
                    endAdornment={dimensionUnit ?? CommodityDimensionUnitEnum.INCHES}
                />
                <PrefixedField
                    disabled={isDisabled}
                    name='height'
                    component={TextField}
                    placeholder=''
                    type='number'
                    endAdornment={dimensionUnit ?? CommodityDimensionUnitEnum.INCHES}
                />
                <PrefixedField disabled={isDisabled} name='freightClass' component={FreightClassesSelect} placeholder='' />
            </FieldPrefix>
            {!isDisabled && (
                <div className={cn('tip-icon')}>
                    <IconButton Icon={TrashIcon} onClick={onDelete} />
                </div>
            )}
        </div>
    );
};
