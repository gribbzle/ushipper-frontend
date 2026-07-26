import React from 'react';

import { SidebarCountsEnum } from '@/enums';

import {
    CogIcon,
    CommentIcon,
    DollarCoinIcon,
    FourTilesIcon,
    GroupIcon,
    HeadphonesIcon,
    JobListingIcon,
    OpenTruckIcon,
    TransformIcon,
    TruckIcon,
} from '../icons';
import { Route } from '../sidebar.types';

export const driverRoutes: Route[] = [
    { name: 'dashboard-tab-label', href: '/client/dashboard', as: '/dashboard', icon: <FourTilesIcon /> },
    { name: 'wallet-tab-label', href: '/client/wallet', as: '/wallet', icon: <DollarCoinIcon /> },
    {
        name: 'loadboard-block-label',
        type: 'block',
    },
    {
        name: 'available-orders-tab-label',
        href: '/client/loadboard',
        as: '/available-orders',
        icon: <TransformIcon />,
    },
    {
        name: 'my-orders-block-label',
        type: 'block',
        permissions: [
            { scope: 'shipperOrders', functionality: 'shipper.my_orders.all_orders.view_any' },
            { scope: 'carrierOrders', functionality: 'carrier.orders.view_any' },
        ],
    },
    {
        name: 'orders-tab-label',
        href: '/client/orders',
        as: '/orders',
        icon: <TruckIcon />,
        labelCountField: SidebarCountsEnum.countOfNewOrders,
        permissions: [
            { scope: 'shipperOrders', functionality: 'shipper.my_orders.all_orders.view_any' },
            { scope: 'carrierOrders', functionality: 'carrier.orders.view_any' },
        ],
        subRoutes: ['/client/orders/create', '/client/orders/[order-id]', '/client/orders/[order-id]/edit'],
    },

    { name: 'communications-block-label', type: 'block' },
    {
        name: 'messages-tab-label',
        href: '/client/messages',
        as: '/messages',
        icon: <CommentIcon />,
        labelCountField: SidebarCountsEnum.unreadChatMessagesCount,
    },

    { name: 'profi-exchange-block-label', type: 'block' },
    { name: 'carriers-tab-label', href: '/client/catalogs/carriers', as: '/catalogs/carriers', icon: <OpenTruckIcon /> },
    { name: 'dispatchers-tab-label', href: '/client/catalogs/dispatchers', as: '/catalogs/dispatchers', icon: <HeadphonesIcon /> },
    { name: 'drivers-tab-label', href: '/client/catalogs/drivers', as: '/catalogs/drivers', icon: <GroupIcon /> },
    {
        name: 'job-offers-tab-label',
        href: '/client/job-offers',
        as: '/job-offers',
        icon: <JobListingIcon />,
        permissions: [
            { scope: 'carrierAdministration', functionality: 'common.administration.job_offer.view_any' },
            { scope: 'dispatcherAdministration', functionality: 'common.administration.job_offer.view_any' },
            { scope: 'driverAdministration', functionality: 'common.administration.job_offer.view_any' },
        ],
    },
    { name: 'administration-block-label', type: 'block' },
    { name: 'profile-settings-tab-label', href: '/client/profile-settings', as: '/profile-settings', icon: <CogIcon /> },
];
