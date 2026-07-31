import React from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { CheckingContractPopup } from '@/components/client/loadboard/checking-contract-popup/checking-contract-popup';
import { LoadboardFilterTabs } from '@/components/client/loadboard/loadboard-filter-tabs/loadboard-filter-tabs';
import { LoadboardNoticePopup } from '@/components/client/loadboard/loadboard-notice-popup/loadboard-notice-popup';
import { LoadboardSaveSearchPopup } from '@/components/client/loadboard/loadboard-save-search-popup/loadboard-save-search-popup';
import { OrderRequestDrawer } from '@/components/client/loadboard/order-request-drawer/order-request-drawer';
import { ParsedOrderDetailsDrawer } from '@/components/client/loadboard/parsed-order-details-drawer/parsed-order-details-drawer';
import DeclineModal from '@/components/client/offers/decline-modal/decline-modal';
import OfferDrawer from '@/components/client/offers/offer-drawer/offer-drawer';
import { OrderChatDrawer } from '@/components/client/orders/drawers/order-chat-drawer/order-chat-drawer';
import { BetweenPhonesChatDrawer } from '@/components/common/between-phones-chat-drawer/between-phones-chat-drawer';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useLoadboard } from '@hooks';
import { classname } from '@utils/classname';

import { LoadboardContent } from '../loadboard-content';
import { LoadboardPageHeader } from '../loadboard-page-header';

import './loadboard-page.scss';

const cn = classname('loadboard');

const AdminLoadboard = () => {
    const { loadBoardFilters, saveSearchDrawer, isError, error, onCloseDrawer, onSelectTab } = useLoadboard();

    return (
        <div className={cn()}>
            {!isError && (
                <>
                    <LoadboardFilterTabs onSelectTab={onSelectTab} />
                    <LoadboardContent />

                    <OfferDrawer />
                    <OrderRequestDrawer loadBoardFilters={loadBoardFilters} />
                    <ParsedOrderDetailsDrawer loadBoardFilters={loadBoardFilters} />
                    <DeclineModal />
                    <LoadboardSaveSearchPopup isOpen={saveSearchDrawer.opened} onClose={onCloseDrawer} />
                    <CheckingContractPopup loadBoardFilters={loadBoardFilters} />
                    <LoadboardNoticePopup />
                    <OrderChatDrawer />
                    <BetweenPhonesChatDrawer />
                </>
            )}
            {isError && (error as AxiosResponse<AxiosError>).status === 403 && <AccessForbiddenBlock />}
        </div>
    );
};

AdminLoadboard.getLayout = getMainLayout({
    head: <LoadboardPageHeader />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.loadboard.view_any' }],
});

export default AdminLoadboard;
