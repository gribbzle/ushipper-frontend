import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './shipper-tracking-field-wrapper.scss';

const cn = classname('shipper-tracking-field-wrapper');

export const ShipperTrackingFieldWrapper = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className={cn('')}>
        {title}
        {children}
    </div>
);
