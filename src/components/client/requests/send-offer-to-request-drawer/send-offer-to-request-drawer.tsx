import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DrawerBody } from '@/components/client/requests/send-offer-to-request-drawer/drawer-body';
import { Drawer } from '@components';
import { AppState } from '@store';
import { requestsSliceActions } from '@store/client/requests/slice';
import { classname, translateByNamespace } from '@utils';

import './requests-send-offer.scss';

const orderPageSendOffer = translateByNamespace('client:orders-page:send-offer-to-carrier:drawer');
const cn = classname('requests-send-offer');

export const SendOfferToRequestDrawer = () => {
    const sendOfferDrawer = useSelector((state: AppState) => {
        return state.client.requests.sendOfferDrawer;
    });

    const dispatch = useDispatch();
    const onClose = () => {
        dispatch(
            requestsSliceActions.setRequestDrawer({
                isOpen: false,
            }),
        );
    };

    return (
        <Drawer
            className={cn('drawer')}
            onTop={true}
            isOpen={sendOfferDrawer.isOpen}
            onClose={onClose}
            head={orderPageSendOffer('header')}
            body={
                <>
                    {sendOfferDrawer.order && sendOfferDrawer.request && (
                        <DrawerBody closeDrawer={onClose} request={sendOfferDrawer.request} order={sendOfferDrawer.order} />
                    )}
                </>
            }
        />
    );
};
