import React from 'react';
import { useRouter } from 'next/router';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';
import { Button } from '@/components/common/button/button';
import { OfferStatusesEnum } from '@/enums';
import { useMeCarrier } from '@hooks';
import { useAppDispatch } from '@store';
import { orderOffersApi, useCancelOfferMutation } from '@store/api/order-offers';
import { OrderOffer } from '@store/common/orders/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './offer-item-actions.scss';

const cn = classname('offer-item-actions');
const t = translateByNamespace('client:order-offers:item');

type Props = {
    offer: OrderOffer;
};

export const OfferItemActions = ({ offer }: Props) => {
    const router = useRouter();
    const isMeCarrier = useMeCarrier();

    const openDrawer = async (tab: OfferTabsEnum) => {
        await router.push(
            {
                pathname: router.pathname,
                query: {
                    drawerOfferId: offer.publicId,
                    drawerTab: tab,
                },
            },
            {
                pathname: router.asPath,
                query: {
                    drawerOfferId: offer.publicId,
                    drawerTab: tab,
                },
            },
        );
    };

    const dispatch = useAppDispatch();
    const [cancelOffer] = useCancelOfferMutation();
    const cancelOfferHandler = async () => {
        await cancelOffer(offer.publicId);
        dispatch(orderOffersApi.util.invalidateTags([{ type: 'Offers', id: 'LIST' }, { type: 'OffersStats' }]));
    };

    const openDeclinationModal = async () => {
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
    };

    const openLoad = async () => {
        let orderId: string | undefined | null = offer.order.publicId;

        if (isMeCarrier) {
            orderId = offer.order.carrierOrder?.publicId;
        }
        if (orderId) {
            const asCreatePath = `/orders/${orderId}`;

            await router.push(
                {
                    pathname: '/client/orders/[order-id]',
                    query: {
                        ['order-id']: orderId,
                    },
                },
                `${asCreatePath}`,
            );
        }
        console.error('No order id', offer);
    };

    return (
        <div className={cn()}>
            {!(offer.status === OfferStatusesEnum.NEW && isMeCarrier) && (
                <Button size='small' onClick={() => openDrawer(OfferTabsEnum.details)}>
                    {t('view-offer')}
                </Button>
            )}
            {offer.status === OfferStatusesEnum.NEW && (
                <>
                    {isMeCarrier && (
                        <Button size='small' view='primary' onClick={() => openDrawer(OfferTabsEnum.details)}>
                            {t('accept-offer')}
                        </Button>
                    )}
                    <Button size='small' onClick={() => openDrawer(OfferTabsEnum.message)}>
                        {t('message')}
                    </Button>
                    {isMeCarrier ? (
                        <Button size='small' onClick={openDeclinationModal}>
                            {t('decline')}
                        </Button>
                    ) : (
                        <Button size='small' onClick={cancelOfferHandler}>
                            {t('cancel-offer')}
                        </Button>
                    )}
                </>
            )}
            {offer.status === OfferStatusesEnum.ACCEPTED && (
                <Button size='small' onClick={openLoad}>
                    {t('open-load')}
                </Button>
            )}
        </div>
    );
};
