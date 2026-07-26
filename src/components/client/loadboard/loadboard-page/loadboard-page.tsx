import React from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import DeclineModal from '@/components/client/offers/decline-modal/decline-modal';
import OfferDrawer from '@/components/client/offers/offer-drawer/offer-drawer';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import {
    BetweenPhonesChatDrawer,
    CheckingContractPopup,
    LoadboardFilterTabs,
    LoadboardNoticePopup,
    LoadboardSaveSearchPopup,
    OrderChatDrawer,
    OrderRequestDrawer,
    ParsedOrderDetailsDrawer,
} from '@components';
import { useLoadboard, useMeShipper } from '@hooks';
import { classname } from '@utils';

import { LoadboardContent } from '../loadboard-content';
import { LoadboardPageHeader } from '../loadboard-page-header';

import './loadboard-page.scss';

const cn = classname('loadboard');

const Loadboard = () => {
    const isMeShipper = useMeShipper();

    const { loadBoardFilters, saveSearchDrawer, isError, error, onCloseDrawer, onSelectTab } = useLoadboard();

    return (
        <div className={cn()}>
            {!isError && (
                <>
                    {!isMeShipper && <LoadboardFilterTabs onSelectTab={onSelectTab} />}
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

Loadboard.getLayout = getMainLayout({
    head: <LoadboardPageHeader />,
});

export default Loadboard;
