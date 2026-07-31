/* eslint-disable complexity */
import React, { useState } from 'react';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

import { Inspection } from '@/components/client/orders/inspection/inspection';
import { InspectionStub } from '@/components/client/orders/inspection/inspection-stub/inspection-stub';
import { Accordion } from '@/components/common/accordion/accordion';
import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Tabs } from '@/components/common/tabs/tabs';
import { InspectionSubtype } from '@/enums';
import { getFullNameOfVehicle } from '@/utils/vehicle';
import { useAppSelector } from '@store';
import { useGetOrderVehicleInspectionsQuery } from '@store/api/order-vehicle-api';
import { OrderVehicle } from '@store/api/orders-api';
import { orderDeliveryInformationSelector, orderDriverSelector, orderPickupInformationSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-inspection.scss';

const cn = classname('order-inspection');
const t = translateByNamespace('client:order:inspection');

type InspectionTabs = {
    label: string;
    value: InspectionSubtype;
}[];

type OrderInspectionProps = {
    vehicle: OrderVehicle;
    orderId: string;
    isClose: boolean;
};

export const OrderInspection = ({ vehicle, orderId, isClose }: OrderInspectionProps) => {
    const { data: inspections } = useGetOrderVehicleInspectionsQuery({ orderId, vehicleId: vehicle.id });

    const pickupInformation = useAppSelector(orderPickupInformationSelector);
    const pickupDriverSignatureName = pickupInformation?.driverSignature?.signature?.owner?.name;
    const pickupDriverSignatureNickname = pickupInformation?.driverSignature?.signature?.owner?.nickname;
    const pickupDriverSignatureSignedAt = pickupInformation?.driverSignature?.signedAt;

    const driver = useAppSelector(orderDriverSelector);
    const driverName = driver?.name;

    const deliveryInformation = useAppSelector(orderDeliveryInformationSelector);
    const deliveryDriverSignatureName = deliveryInformation?.driverSignature?.signature?.owner?.name;
    const deliveryDriverSignatureNickname = deliveryInformation?.driverSignature?.signature?.owner?.nickname;
    const deliveryDriverSignatureSignedAt = deliveryInformation?.driverSignature?.signedAt;

    const { schematicPhoto } = vehicle;

    const inspectionTabs = [
        { label: t('pickup'), value: 'pickup' },
        { label: t('delivery'), value: 'delivery' },
    ] as InspectionTabs;

    const [currentTab, setCurrentTab] = useState(inspectionTabs[0]);

    return inspections ? (
        <div className={cn()}>
            <Accordion opened={isClose} title={getFullNameOfVehicle(vehicle)} rightAddon={vehicle.vin && <span className={cn('vin')}>{vehicle.vin}</span>}>
                <div className={cn('inspection-tab-container')}>
                    <Tabs tabs={inspectionTabs} onSelectTab={setCurrentTab} />
                    <div className={cn('inspection-content')}>
                        {currentTab.value === 'pickup' &&
                            (inspections?.pickup ? (
                                <>
                                    {pickupDriverSignatureName && pickupDriverSignatureSignedAt ? (
                                        <AlertBlock>
                                            {t('pickup-alert-signature', {
                                                name: pickupDriverSignatureName + (pickupDriverSignatureNickname ? ` (${pickupDriverSignatureNickname})` : ''),
                                                date: formatInTimeZone(
                                                    new Date(pickupDriverSignatureSignedAt),
                                                    pickupInformation?.timezone || 'America/Los_Angeles',
                                                    'MMM d, h:mm a (zzz)',
                                                    { locale: enUS },
                                                ),
                                            })}
                                        </AlertBlock>
                                    ) : (
                                        <AlertBlock view='warning'>
                                            {t('not-signed-inspection', {
                                                name: driverName ?? '',
                                            })}
                                        </AlertBlock>
                                    )}
                                    <Inspection
                                        inspection={inspections.pickup}
                                        schematicPhotoUrl={
                                            inspections.pickup?.schematicPhoto?.markedPhoto?.url ??
                                            inspections.pickup?.schematicPhoto?.originalPhoto?.url ??
                                            schematicPhoto
                                        }
                                    />
                                </>
                            ) : (
                                <InspectionStub />
                            ))}
                        {currentTab.value === 'delivery' &&
                            (inspections?.delivery ? (
                                <>
                                    {deliveryDriverSignatureName && deliveryDriverSignatureSignedAt ? (
                                        <AlertBlock>
                                            {t('delivery-alert-signature', {
                                                name:
                                                    deliveryDriverSignatureName +
                                                    (deliveryDriverSignatureNickname ? ` (${deliveryDriverSignatureNickname})` : ''),
                                                date: formatInTimeZone(
                                                    new Date(deliveryDriverSignatureSignedAt),
                                                    deliveryInformation?.timezone || 'America/Los_Angeles',
                                                    'MMM d, h:mm a (zzz)',
                                                    { locale: enUS },
                                                ),
                                            })}
                                        </AlertBlock>
                                    ) : (
                                        <AlertBlock view='warning'>
                                            {t('not-signed-inspection', {
                                                name: driverName ?? '',
                                            })}
                                        </AlertBlock>
                                    )}
                                    <Inspection
                                        inspection={inspections.delivery}
                                        schematicPhotoUrl={
                                            inspections.delivery?.schematicPhoto?.markedPhoto?.url ??
                                            inspections.delivery?.schematicPhoto?.originalPhoto?.url ??
                                            schematicPhoto
                                        }
                                    />
                                </>
                            ) : (
                                <InspectionStub />
                            ))}
                    </div>
                </div>
            </Accordion>
        </div>
    ) : null;
};
