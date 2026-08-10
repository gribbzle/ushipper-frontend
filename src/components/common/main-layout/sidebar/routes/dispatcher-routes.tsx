import React from 'react';

import { SidebarCountsEnum } from '@/enums/sidebar-counts-enum';

import { CogIcon, CommentIcon, FourTilesIcon, GroupIcon, HeadphonesIcon, JobListingIcon, OpenTruckIcon, TransformIcon } from '../icons';
import { Route } from '../sidebar.types';

export const dispatcherRoutes: Route[] = [
    { name: 'dashboard-tab-label', href: '/client/dashboard', as: '/dashboard', icon: <FourTilesIcon /> },
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
        ],
    },
    { name: 'administration-block-label', type: 'block' },
    { name: 'profile-settings-tab-label', href: '/client/profile-settings', as: '/profile-settings', icon: <CogIcon /> },
];
