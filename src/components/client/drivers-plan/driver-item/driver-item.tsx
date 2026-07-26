import React, { useMemo } from 'react';

import { Accordion } from '@/components';
import { Paper } from '@/components/common';
import { User } from '@store/common';
import { classname } from '@utils';

import { DriverItemHeader } from './driver-item-header/driver-item-header';
import { DriverOrdersAccordion } from './driver-orders-accordion';

import './driver-item.scss';

type Props = {
    isClose: boolean;
    driver: User;
};

const cn = classname('driver-item');

export const DriverItem = ({ driver, isClose }: Props) => {
    const driverInfo = useMemo(
        () => (
            <Accordion className={cn('content')} opened={isClose} carretSize='large' reverse={true} title={<DriverItemHeader driver={driver} />}>
                <DriverOrdersAccordion driver={driver} />
            </Accordion>
        ),
        [driver, isClose],
    );

    return <Paper className={cn('')} body={driverInfo} />;
};
