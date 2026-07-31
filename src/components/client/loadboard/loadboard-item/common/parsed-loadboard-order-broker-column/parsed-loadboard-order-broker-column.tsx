import React, { useMemo } from 'react';
import has from 'has-values';

import { OrderSourcesEnum } from '@/enums';
import { OctothorpeIcon, PhoneIcon } from '@icons';
import { ExternalCDShipper, ExternalSDShipper } from '@store/client';
import { classname } from '@utils/classname';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import { ExternalBrokerRating, HiddenExternalBrokerTooltip } from '../../../common';

import { ParsedLoadBoardOrderBrokerColumnProps } from './parsed-loadboard-order-broker-column.types';

import './parsed-loadboard-order-broker-column.scss';

const cn = classname('parsed-loadboard-order-broker-column');

export const ParsedLoadBoardOrderBrokerColumn = ({ company, details, orderSource, externalShipper }: ParsedLoadBoardOrderBrokerColumnProps) => {
    const { customerName, externalCompany, phone } = company;
    const { orderId } = details;

    const isCDShipper = orderSource && [OrderSourcesEnum.CENTRAL_DISPATCH_PARSED, OrderSourcesEnum.CENTRAL_DISPATCH].includes(orderSource);
    const isSDShipper = orderSource === OrderSourcesEnum.SUPER_DISPATCH_PARSED;

    const customerNameFromShipper = useMemo(() => {
        if (isCDShipper) return (externalShipper as ExternalCDShipper)?.companyName;
        if (isSDShipper) return (externalShipper as ExternalSDShipper)?.name;
    }, [externalShipper, isCDShipper, isSDShipper]);

    const phoneFromShipper = useMemo(() => {
        if (isCDShipper) return (externalShipper as ExternalCDShipper)?.phone;
        if (isSDShipper) return (externalShipper as ExternalSDShipper)?.contactPhone;
    }, [externalShipper, isCDShipper, isSDShipper]);

    const broker = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                customerName: customerNameFromShipper || customerName,
                phone: phoneFromShipper || phone,
                orderId,
            }),
        [customerNameFromShipper, customerName, phoneFromShipper, phone, orderId],
    );

    const hasCustomerNameOrPhone = 'customerName' in broker && 'phone' in broker;

    return (
        <div className={cn()}>
            {has(broker) && (
                <>
                    {!hasCustomerNameOrPhone && <HiddenExternalBrokerTooltip />}
                    {'customerName' in broker && <div className={cn('name')}>{broker.customerName}</div>}
                    <ExternalBrokerRating orderSource={orderSource} externalShipper={externalShipper} externalCompany={externalCompany} />
                    {'phone' in broker && broker.phone && (
                        <div className={cn('item')}>
                            <PhoneIcon />
                            <a href={`tel:${broker.phone.replace(' x', ',')}`}>{broker.phone}</a>
                        </div>
                    )}
                    {'orderId' in broker && (
                        <div className={cn('item')}>
                            <OctothorpeIcon />
                            <span className={cn('item-id')}>{broker.orderId}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
