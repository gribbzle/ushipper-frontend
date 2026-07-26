import React, { Fragment, useMemo } from 'react';
import has from 'has-values';

import { CommodityWeightUnitEnum } from '@/enums';
import { Ellipse } from '@icons';
import { OrderCommodity } from '@store/api/orders-api';
import { classname, getCommodityTypeTranslate, getFullNameOfCommodity, getSizesOfCommodity } from '@utils';

import './commodity-details.scss';

const cn = classname('commodity-details');

type CommodityDetailsProps = {
    commodity: OrderCommodity;
    inline?: boolean;
};

export const CommodityDetails = ({ commodity, inline = false }: CommodityDetailsProps) => {
    const { name, description, type, weight, quantity, weightUnit } = commodity;

    const sizes = useMemo(() => getSizesOfCommodity(commodity), [commodity]);

    return (
        <div className={cn('', { inline })}>
            <strong className={cn('name')}>{getFullNameOfCommodity({ name, description })}</strong>

            {(quantity || type) && (
                <span className={cn('type')}>
                    {quantity} {!!type && getCommodityTypeTranslate(type, quantity)}
                </span>
            )}
            {has(sizes) && (
                <div className={cn('details')}>
                    {Object.values(sizes).map((value, index) => (
                        <Fragment key={index}>
                            {(index > 0 || inline) && (
                                <span className={cn('ellipse')}>
                                    <Ellipse />
                                </span>
                            )}

                            <span className={cn('value')}>{value}</span>
                        </Fragment>
                    ))}
                </div>
            )}
            {!!weight && (
                <div className={cn('details')}>
                    {inline && (
                        <span className={cn('ellipse')}>
                            <Ellipse />
                        </span>
                    )}
                    <span className={cn('value')}>
                        {weight.toLocaleString('en-US')} {weightUnit ?? CommodityWeightUnitEnum.POUNDS}
                    </span>
                </div>
            )}
        </div>
    );
};
