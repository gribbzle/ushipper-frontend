import React, { useMemo } from 'react';
import has from 'has-values';
import { useRouter } from 'next/router';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { TooltipContent } from '@/components/common/tooltip/tooltip';
import { TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { useCanManageOrder } from '@/hooks/order';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { getVehicleTypeTranslation } from '@/utils/vehicle';
import { PencilIcon, TrashIcon } from '@icons';
import { useGetOrderVehicleInspectionsQuery } from '@store/api/order-vehicle-api';
import { OrderVehicle } from '@/shared/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import './vehicle-item.scss';

const t = translateByNamespace('client:order:vehicles:fields');
const cn = classname('vehicle-item');

type VehicleItemProps = {
    className?: string;
    vehicle: OrderVehicle;
    onDeleteVehicleClick: () => void;
    onEditVehicleClick: () => void;
};

export const VehicleItem = ({ vehicle, className, onDeleteVehicleClick, onEditVehicleClick }: VehicleItemProps) => {
    const { year, make, model, color, type, vin, enclosed, inop, lotNumber } = vehicle;
    const router = useRouter();
    const orderId = router.query['order-id'] as string;
    const { data: inspections } = useGetOrderVehicleInspectionsQuery({ orderId, vehicleId: vehicle.id }, { skip: !(orderId && vehicle.id) });
    const canPerformActions = useCanManageOrder();

    const vehicleName = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                year,
                make,
                model,
            }),
        [make, model, year],
    );

    const firstLine = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                vehicleName,
                color,
                type,
                lotNumber,
            }),
        [color, type, vehicleName, lotNumber],
    );

    const secondLine = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                vin,
                enclosed,
                inop,
            }),
        [enclosed, inop, vin],
    );

    const isDisabled = useDisableProductChanging();
    const isDisabledDeleteBtn = useMemo(() => !!inspections?.delivery || !!inspections?.pickup, [inspections]);

    return (
        <div key={vin} className={cn('', [className])}>
            <div className={cn('vehicle-info')}>
                {has(firstLine) && (
                    <div className={cn('first-line')}>
                        {has(vehicleName) && <strong>{Object.values(vehicleName).join(' ')}</strong>}
                        {color && <span className={cn('color')}>{color}</span>}
                        {type && <span className={cn('type')}>{getVehicleTypeTranslation(vehicle)}</span>}
                        {lotNumber && <span className={cn('type')}>#{lotNumber}</span>}
                    </div>
                )}
                {has(secondLine) && (
                    <div className={cn('second-line')}>
                        {vin && <span className={cn('vin')}>{vin.toUpperCase()}</span>}
                        {enclosed && <OrderTag view='enclosed'>{t('enclosed-label')}</OrderTag>}
                        {inop && <OrderTag view='inop'>{t('inop-label')}</OrderTag>}
                    </div>
                )}
                {(vehicle.price || vehicle.price === 0) && <span className={cn('price')}>{formatToCurrency(vehicle.price)}</span>}
            </div>

            {!canPerformActions || isDisabled ? null : (
                <div className={cn('actions')}>
                    <IconButton Icon={PencilIcon} onClick={onEditVehicleClick} />
                    <Tooltip>
                        <TooltipTrigger asChild={true}>
                            <div className={cn('tip-icon')}>
                                <IconButton Icon={TrashIcon} onClick={onDeleteVehicleClick} disabled={isDisabledDeleteBtn} />
                            </div>
                        </TooltipTrigger>
                        {isDisabledDeleteBtn && <TooltipContent className={cn('tip')}>{t('no-delete-tip')}</TooltipContent>}
                    </Tooltip>
                </div>
            )}
        </div>
    );
};
