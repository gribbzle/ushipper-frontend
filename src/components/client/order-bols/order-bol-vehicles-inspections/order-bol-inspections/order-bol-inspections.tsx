import React, { useMemo } from 'react';

import { Divider, Inspection, InspectionStub } from '@components';
import { OrderBOLVehicle } from '@store/api/order-bol-api';
import { classname, translateByNamespace } from '@utils';

import './order-bol-inspections.scss';

const cn = classname('inspections-container');
const t = translateByNamespace('client:order-BOL-page');

type Props = {
    vehicle: OrderBOLVehicle;
};

export const OrderBolInspections = ({ vehicle }: Props) => {
    const pickupInspection = vehicle.inspections?.pickup;
    const deliveryInspection = vehicle.inspections?.delivery;

    const schematicPhotoUrl = useMemo(
        () => pickupInspection?.schematicPhoto.markedPhoto?.url ?? pickupInspection?.schematicPhoto.originalPhoto.url ?? vehicle.schematicPhoto,
        [pickupInspection?.schematicPhoto.markedPhoto?.url, pickupInspection?.schematicPhoto.originalPhoto.url, vehicle.schematicPhoto],
    );

    return (
        <div className={cn('')}>
            {pickupInspection ? (
                <div className={cn('inspection-container')}>
                    <span className={cn('title')}>{t('pickup-inspection')}</span>
                    <Inspection inspection={pickupInspection} schematicPhotoUrl={schematicPhotoUrl} />
                </div>
            ) : (
                <InspectionStub />
            )}
            <Divider orientation='vertical' lineStyle='dashed' />
            {deliveryInspection ? (
                <div className={cn('inspection-container')}>
                    <span className={cn('title')}>{t('delivery-inspection')}</span>
                    <Inspection inspection={deliveryInspection} schematicPhotoUrl={schematicPhotoUrl} />
                </div>
            ) : (
                <InspectionStub />
            )}
        </div>
    );
};
