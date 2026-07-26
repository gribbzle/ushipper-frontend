import React, { ReactNode } from 'react';

import { Paper } from '@components';
import { CarriersCatalogInfo, DispatcherCatalogInfo } from '@store/client';
import { classname } from '@utils';

import { CarrierItemBody } from './carrier-item-body';
import { DispatcherItemBody } from './dispatcher-item-body';

import './catalog-item.scss';

const cn = classname('catalog-item');

const CatalogItem = ({ isFlagged, bodyComponent }: { isFlagged: boolean; bodyComponent: ReactNode }) => (
    <Paper className={cn('', { flagged: isFlagged })} body={bodyComponent} bodyClassName={cn()} />
);

export const DispatcherItem = ({ info }: { info: DispatcherCatalogInfo }) => (
    <CatalogItem isFlagged={info.isFlagged} bodyComponent={<DispatcherItemBody dispatcher={info} />} />
);

export const CarrierItem = ({ info }: { info: CarriersCatalogInfo }) => (
    <CatalogItem isFlagged={info.isFlagged} bodyComponent={<CarrierItemBody carrier={info} />} />
);
