import React, { useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import { toast } from 'react-toastify';

import { Loader, Paper } from '@/components';
import { useShipperTrackingDriver } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { selectedShipperTrackingOrderSelector, trackingActions } from '@store/client';
import { classname, isTrackingOrderNotDispatched, translateByNamespace } from '@utils';

import { DriverInfoContent } from './driver-info-content';

import './driver-info-paper.scss';

type DriverInfoPaperProps = {
    top?: number;
    left?: number;
};

const cn = classname('driver-info-paper');
const t = translateByNamespace('client:tracking-page:driver-info-paper');

export const DriverInfoPaper = ({ top, left }: DriverInfoPaperProps) => {
    const dispatch = useAppDispatch();
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);
    const isOrderNotDispatched = selectedOrder && isTrackingOrderNotDispatched(selectedOrder);

    const { driver, driverPublicId, isError, isFetching } = useShipperTrackingDriver();

    useEffect(() => {
        if (isError) {
            toast.error(t<string>('upload-drivers-error'));
            dispatch(trackingActions.setSelectedDriverId(null));
        }
    }, [isError, dispatch]);

    const body = useMemo(() => {
        if (isFetching) {
            return (
                <div className={cn('row', { empty: true })}>
                    <Loader />
                </div>
            );
        }

        if (!driver) {
            return null;
        }

        return <DriverInfoContent driver={driver} />;
    }, [driver, isFetching]);

    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setPosition({ x: 0, y: 0 });
    }, [driverPublicId]);

    if (!isOrderNotDispatched || !driver || isError) {
        return null;
    }

    return (
        <Draggable position={position} onStop={(_, data) => setPosition({ x: data.x, y: data.y })}>
            <div
                className={cn('', { danger: !top || !left })}
                style={{
                    top: top ?? 250,
                    left: left ?? '43%',
                }}
            >
                <Paper body={body} />
            </div>
        </Draggable>
    );
};
