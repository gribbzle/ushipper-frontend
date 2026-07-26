import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useOrder } from '@/hooks/order';
import { getFullNameOfVehicle } from '@/utils/vehicle';
import { Link } from '@components';
import { classname, getFullNameOfCommodity, isFreightX, isUshipper, translateByNamespace } from '@utils';

import './admin-order-id-info.scss';

const cn = classname('admin-order-id-info');
const t = translateByNamespace('admin:orders-page');

type OrderIdInfoProps = {
    showProducts?: boolean;
    showPublicId: boolean;
    className?: string;
};

export const AdminOrderIdInfo = ({ showPublicId, showProducts = true, className }: OrderIdInfoProps) => {
    const {
        type,
        vehicles,
        commodities,
        publicId,
        details: { orderId },
    } = useOrder();

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(publicId);
        toast.success(t<string>('notifications.copied-public-id-success-notification'));
    }, [publicId]);

    const vehicleNames = useMemo(() => vehicles?.map(vehicle => getFullNameOfVehicle(vehicle)).join(', '), [vehicles]);
    const commodityNames = useMemo(() => commodities?.map(commodity => getFullNameOfCommodity(commodity)).join(', '), [commodities]);

    return (
        <div className={cn('', [className])}>
            <h4>
                <Link
                    href={{
                        pathname: `/admin/orders/${type}/[order-id]`,
                        query: { ['order-id']: publicId },
                    }}
                    as={`/admin/orders/${type}/${publicId}`}
                >
                    {orderId ?? t('no-order-id')}
                </Link>
            </h4>
            {showPublicId && (
                <p className={cn('sub-text')} onClick={handleCopy} title={t('click-to-copy')}>
                    {publicId}
                </p>
            )}
            {showProducts && (
                <>
                    {isUshipper && vehicles?.length > 0 && <p className={cn('sub-text')}>{vehicleNames}</p>}
                    {isFreightX && commodities?.length > 0 && <p className={cn('sub-text')}>{commodityNames}</p>}
                </>
            )}
        </div>
    );
};
