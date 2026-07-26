import React from 'react';

import { SidebarCountsEnum } from '@/enums';

import {
    BlackListIcon,
    CogIcon,
    CommentIcon,
    ContactIcon,
    FlagIcon,
    GroupIcon,
    HeadphonesIcon,
    JobListingIcon,
    LineBrokenIcon,
    OpenTruckIcon,
    PoiIcon,
    TransformIcon,
    TruckIcon,
} from '../icons';
import { Route } from '../sidebar.types';

export const carrierRoutes: Route[] = [
    {
        name: 'loadboard-block-label',
        type: 'block',
        permissions: [
            { scope: 'carrierOrders', functionality: 'carrier.order_board.available_orders.view_any' },
            { scope: 'shipperOrders', functionality: 'shipper.order_board.available_orders.view_any' },
        ],
    },
    {
        name: 'available-orders-tab-label',
        href: '/client/loadboard',
        as: '/available-orders',
        icon: <TransformIcon />,
        permissions: [
            { scope: 'carrierOrders', functionality: 'carrier.order_board.available_orders.view_any' },
            { scope: 'shipperOrders', functionality: 'shipper.order_board.available_orders.view_any' },
        ],
    },
    {
        name: 'offers-tab-label',
        href: '/client/offers',
        as: '/offers',
        icon: <FlagIcon />,
        labelCountField: SidebarCountsEnum.countOfNewOffers,
        permissions: [
            { scope: 'carrierOrders', functionality: 'carrier.orders.offers.view_any' },
            { scope: 'shipperOrders', functionality: 'shipper.my_orders.offers.view_any' },
        ],
    },
    {
        name: 'drivers-plan',
        href: '/client/drivers-plan',
        as: '/drivers-plan',
        icon: <LineBrokenIcon />,
    },
    {
        name: 'black-list-tab-label',
        href: '/client/black-list',
        as: '/black-list',
        icon: <BlackListIcon />,
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
    {
        name: 'tracking-tab-label',
        href: '/client/tracking',
        as: '/tracking',
        icon: <PoiIcon />,
        permissions: [
            { scope: 'carrierOrders', functionality: 'carrier.tracking.view_any' },
            { scope: 'shipperOrders', functionality: 'shipper.tracking.view_any' },
        ],
    },
    {
        name: 'contacts-tab-label',
        href: '/client/contacts',
        as: '/contacts',
        icon: <ContactIcon />,
        permissions: [
            { scope: 'carrierOrders', functionality: 'carrier.contacts.view_any' },
            { scope: 'shipperOrders', functionality: 'shipper.my_orders.contacts.view_any' },
        ],
    },

    { name: 'communications-block-label', type: 'block' },
    {
        name: 'messages-tab-label',
        href: '/client/messages',
        as: '/messages',
        icon: <CommentIcon />,
        labelCountField: SidebarCountsEnum.unreadChatMessagesCount,
    },

    {
        name: 'administration-block-label',
        type: 'block',
        permissions: [
            { scope: 'shipperAdministration', functionality: 'shipper.administration.staff.view_any' },
            { scope: 'carrierAdministration', functionality: 'carrier.administration.staff.view_any' },
        ],
    },
    {
        name: 'staff-tab-label',
        href: '/client/staff',
        as: '/staff',
        icon: <GroupIcon />,
        permissions: [
            { scope: 'shipperAdministration', functionality: 'shipper.administration.staff.view_any' },
            { scope: 'carrierAdministration', functionality: 'carrier.administration.staff.view_any' },
        ],
    },
    {
        name: 'settings-block-label',
        icon: <CogIcon />,
        permissions: [
            { scope: 'carrierAdministration', functionality: 'carrier.administration.role_settings.view_any' },
            { scope: 'shipperAdministration', functionality: 'shipper.administration.role_settings.view_any' },
            { scope: 'adminPanelSettings', functionality: 'admin_panel.administration.roles.view_any' },
            { scope: 'shipperAdministration', functionality: 'shipper.administration.company_settings.view_any' },
            { scope: 'carrierAdministration', functionality: 'carrier.administration.staff.view_any' },
        ],
        routes: [
            {
                name: 'roles-settings-tab-label',
                href: '/client/settings/roles',
                as: '/settings/roles',
                permissions: [
                    { scope: 'carrierAdministration', functionality: 'carrier.administration.role_settings.view_any' },
                    { scope: 'shipperAdministration', functionality: 'shipper.administration.role_settings.view_any' },
                    { scope: 'adminPanelSettings', functionality: 'admin_panel.administration.roles.view_any' },
                ],
            },
            {
                name: 'company-settings-tab-label',
                href: '/client/settings/company',
                as: '/settings/company',
                permissions: [
                    { scope: 'shipperAdministration', functionality: 'shipper.administration.company_settings.view_any' },
                    { scope: 'carrierAdministration', functionality: 'carrier.administration.staff.view_any' },
                ],
            },
        ],
    },
    { name: 'profi-exchange-block-label', type: 'block' },
    { name: 'drivers-tab-label', href: '/client/catalogs/drivers', as: '/catalogs/drivers', icon: <GroupIcon /> },
    { name: 'dispatchers-tab-label', href: '/client/catalogs/dispatchers', as: '/catalogs/dispatchers', icon: <HeadphonesIcon /> },
    { name: 'carriers-tab-label', href: '/client/catalogs/carriers', as: '/catalogs/carriers', icon: <OpenTruckIcon /> },
    {
        name: 'job-offers-tab-label',
        href: '/client/job-offers',
        as: '/job-offers',
        icon: <JobListingIcon />,
        permissions: [
            { scope: 'carrierAdministration', functionality: 'common.administration.job_offer.view_any' },
            { scope: 'dispatcherAdministration', functionality: 'common.administration.job_offer.view_any' },
        ],
    },
];
