import React from 'react';

import { SidebarCountsEnum } from '@/enums';

import { AccountingIcon, ArchiveIcon, BriefcaseIcon, CogIcon, CommentIcon, ContactIcon, GasStationIcon, GroupIcon, TransformIcon } from '../icons';
import { Route } from '../sidebar.types';

import { filterRoutes } from './utils';

const baseAdminRoutes: Route[] = [
    {
        name: 'loadboard-tab-label',
        href: '/admin/loadboard',
        icon: <TransformIcon />,
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.loadboard.view_any' }],
    },
    {
        name: 'orders-tab-label',
        icon: <ArchiveIcon />,
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.orders.view_any' }],
        routes: [
            {
                name: 'orders-carrier-tab-label',
                href: '/admin/orders/carrier',
                permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.orders.view_any' }],
            },
            {
                name: 'orders-shipper-tab-label',
                href: '/admin/orders/shipper',
                permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.orders.view_any' }],
            },
        ],
    },
    {
        name: 'companies-tab-label',
        href: '/admin/companies',
        icon: <BriefcaseIcon />,
        subRoutes: ['/admin/companies/[company-id]'],
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.companies.view_any' }],
    },
    {
        name: 'users-tab-label',
        href: '/admin/users',
        icon: <GroupIcon />,
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.users.view_any' }],
    },
    {
        name: 'messages-tab-label',
        href: '/admin/messages',
        icon: <CommentIcon />,
        labelCountField: SidebarCountsEnum.unreadChatMessagesCount,
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.chats.view_any' }],
    },

    {
        name: 'accounting-block-label',
        icon: <AccountingIcon />,
        permissions: [
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.black_list_items.view_any' },
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.transactions.view_any' },
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.accounting.cod_cop_orders' },
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.issues.view_any' },
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.carriers.view_any' },
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.drivers.view_any' },
            { scope: 'adminPanelAccounting', functionality: 'admin_panel.fees.view_any' },
        ],
        routes: [
            {
                name: 'transactions-tab-label',
                href: '/admin/accounting/transactions',
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.transactions.view_any' }],
            },
            {
                name: 'wallets-tab-label',
                href: '/admin/accounting/wallets',
                permissions: [
                    { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.factoring' },
                    { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.ushipper' },
                    { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.dispatch' },
                    { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.cod' },
                    { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.broker' },
                    { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.custom_wallets' },
                ],
            },
            {
                name: 'cod-cop-tab-label',
                href: '/admin/accounting/cod-cop',
                labelCountField: SidebarCountsEnum.driverPaymentRequestsCounter,
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.accounting.cod_cop_orders' }],
            },
            {
                name: 'alerts-label',
                href: '/admin/accounting/alerts',
                labelCountField: SidebarCountsEnum.issuesCounter,
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.issues.view_any' }],
            },
            {
                name: 'carriers-tab-label',
                href: '/admin/accounting/carriers',
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.carriers.view_any' }],
            },
            {
                name: 'drivers-tab-label',
                href: '/admin/accounting/drivers',
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.drivers.view_any' }],
            },
            {
                name: 'fee-categories-settings-tab-label',
                href: '/admin/accounting/fee-categories-settings',
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.fees.view_any' }],
            },
            {
                name: 'black-list-tab-label',
                href: '/admin/accounting/black-list',
                permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.black_list_items.view_any' }],
            },
        ],
    },
    {
        name: 'fuel-block-label',
        icon: <GasStationIcon />,
        permissions: [
            { scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.cards.view_any' },
            { scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.transactions.view_any' },
        ],

        routes: [
            {
                name: 'cards-tab-label',
                href: '/admin/fuel/cards',
                permissions: [{ scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.cards.view_any' }],
            },
            {
                name: 'transactions-tab-label',
                href: '/admin/fuel/transactions',
                permissions: [{ scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.transactions.view_any' }],
            },
        ],
    },
    {
        name: 'contacts-tab-label',
        href: '/admin/contacts',
        icon: <ContactIcon />,
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.contacts.view_any' }],
    },
    {
        name: 'administrators-tab-label',
        href: '/admin/administrators',
        icon: <GroupIcon />,
        permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.administration.administrators.view_any' }],
    },
    {
        name: 'settings-block-label',
        icon: <CogIcon />,
        permissions: [
            { scope: 'carrierAdministration', functionality: 'carrier.administration.role_settings.view_any' },
            { scope: 'shipperAdministration', functionality: 'shipper.administration.role_settings.view_any' },
            { scope: 'adminPanelSettings', functionality: 'admin_panel.administration.roles.view_any' },
            { scope: 'adminPanelSettings', functionality: 'admin_panel.settings.preferences.view_any' },
            { scope: 'adminPanelSettings', functionality: 'admin_panel.settings.car_makers.view_any' },
            { scope: 'adminPanelSettings', functionality: 'admin_panel.settings.cars_models.view_any' },
        ],
        routes: [
            {
                name: 'roles-settings-tab-label',
                href: '/admin/settings/roles',
                permissions: [
                    { scope: 'carrierAdministration', functionality: 'carrier.administration.role_settings.view_any' },
                    { scope: 'shipperAdministration', functionality: 'shipper.administration.role_settings.view_any' },
                    { scope: 'adminPanelSettings', functionality: 'admin_panel.administration.roles.view_any' },
                ],
            },
            {
                name: 'preferences-tab-label',
                href: '/admin/settings/preferences',
                permissions: [{ scope: 'adminPanelSettings', functionality: 'admin_panel.settings.preferences.view_any' }],
            },
            {
                name: 'car-makers-tab-label',
                href: '/admin/settings/car-makers',
                permissions: [{ scope: 'adminPanelSettings', functionality: 'admin_panel.settings.car_makers.view_any' }],
            },
            {
                name: 'car-models-tab-label',
                href: '/admin/settings/car-models',
                permissions: [{ scope: 'adminPanelSettings', functionality: 'admin_panel.settings.cars_models.view_any' }],
            },
        ],
    },
];

const excludedRoutesForFreightX = ['cod-cop-tab-label', 'car-makers-tab-label', 'car-models-tab-label'];

export const freightXAdminRoutes: Route[] = filterRoutes(baseAdminRoutes, excludedRoutesForFreightX);
export const ushipperAdminRoutes: Route[] = [...baseAdminRoutes];
