import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import DetailsBody from '@/components/client/offers/offer-drawer/details-body/details-body';
import { OfferChat } from '@/components/client/offers/offer-drawer/offer-chat';
import { OfferStatusesEnum } from '@/enums';
import { Button, Drawer, OfferDrawerTabs, TabItemBase } from '@components';
import { useMeCarrier, useMeShipper } from '@hooks';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import loadboardApi from '@store/api/loadboard-api';
import { useCancelOfferMutation, useGetOfferQuery, usePartiallyUpdateOfferMutation } from '@store/api/order-offers';
import { isNotificationsDrawerOpenSelector } from '@store/common';
import { classname, translateByNamespace } from '@utils';

import './offer-drawer.scss';

const t = translateByNamespace('client:order-offers');
const cn = classname('offer-drawer');

export enum OfferTabsEnum {
    message = 'message',
    details = 'details',
}
export default function OfferDrawer() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isMeCarrier = useMeCarrier();
    const isMeShipper = useMeShipper();
    const isOpen = useAppSelector(isNotificationsDrawerOpenSelector);

    const onCloseHandler = async () => {
        await router.push(router.pathname, router.asPath.split('?')[0]);
    };

    const offerResponse = useGetOfferQuery(router.query.drawerOfferId as string, { skip: !router.query.drawerOfferId });
    const { data: offer } = offerResponse;

    const [cancelOffer] = useCancelOfferMutation();
    const cancelOfferHandler = async () => {
        if (offer) {
            await cancelOffer(offer.publicId).unwrap();
            await onCloseHandler();
        }
    };

    const [selectedTab, setSelectedTab] = useState(OfferTabsEnum.details);
    const onSelectTabHandler = useCallback(
        (tab: TabItemBase) => {
            setSelectedTab(tab.value as OfferTabsEnum);
        },
        [setSelectedTab],
    );

    useEffect(() => {
        if (router.query.drawerTab) {
            setSelectedTab(router.query.drawerTab as OfferTabsEnum);
        }
    }, [router.query.drawerTab]);

    const [updateOffer] = usePartiallyUpdateOfferMutation();
    const acceptOfferHandler = useCallback(() => {
        if (offer) {
            updateOffer({
                publicOfferId: offer.publicId,
                newOrderData: {
                    status: OfferStatusesEnum.ACCEPTED,
                },
            })
                .unwrap()
                .then(() => {
                    dispatch(
                        loadboardApi.util.invalidateTags([
                            { type: 'Loadboard', id: 'LIST' },
                            { type: 'Loadboard', id: 'Statistic' },
                        ]),
                    );
                });
        }
    }, [offer, updateOffer, dispatch]);

    const openDeclinationModal = useCallback(async () => {
        if (offer) {
            await router.push(
                {
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        openDeclineOfferId: offer.publicId,
                    },
                },
                {
                    pathname: router.asPath.split('?')[0],
                    query: {
                        ...router.query,
                        openDeclineOfferId: offer.publicId,
                    },
                },
            );
        }
    }, [router, offer]);

    return (
        <Drawer
            isOpen={!!router.query.drawerOfferId}
            onClose={onCloseHandler}
            onTop={isOpen}
            head={t('drawer:title')}
            bodyClassName={cn('body')}
            actionsClassName={cn('footer')}
            body={
                <>
                    {offer && (
                        <>
                            <OfferDrawerTabs onSelectTab={onSelectTabHandler} queryTab={router.query.drawerTab} />

                            {selectedTab === OfferTabsEnum.details && <>{offer && <DetailsBody offer={offer} />}</>}
                            {selectedTab === OfferTabsEnum.message && <OfferChat offerPublicId={offer.publicId} offersStatus={offer.status} />}
                        </>
                    )}
                </>
            }
            actions={
                offer?.status === OfferStatusesEnum.NEW &&
                selectedTab === OfferTabsEnum.details && (
                    <>
                        {isMeShipper && (
                            <Button view='danger' onClick={cancelOfferHandler}>
                                <CloseIcon /> {t('drawer:close-offer')}
                            </Button>
                        )}
                        {isMeCarrier && (
                            <div className={cn('carrier-actions')}>
                                <Button view='danger' onClick={openDeclinationModal}>
                                    <CloseIcon /> {t('drawer:decline-offer')}
                                </Button>
                                <Button view='primary' onClick={acceptOfferHandler}>
                                    <CheckIcon /> {t('item:accept-offer')}
                                </Button>
                            </div>
                        )}
                    </>
                )
            }
        />
    );
}
