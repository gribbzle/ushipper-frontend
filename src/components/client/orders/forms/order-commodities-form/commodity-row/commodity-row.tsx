import React from 'react';
import { useFormState } from 'react-final-form';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { CommodityTypesSelect } from '@/components/common/selects/commodity/commodity-types-select/commodity-types-select';
import { FreightClassesSelect } from '@/components/common/selects/commodity/freight-classes-select/freight-classes-select';
import { CommodityDimensionUnitEnum, CommodityWeightUnitEnum } from '@/enums';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { FieldPrefix, PrefixedField, TextField } from '@fields';
import { TrashIcon } from '@icons';
import { OrderFieldsGroup, OrderFormState } from '@store/client';
import { classname } from '@utils/classname';

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
