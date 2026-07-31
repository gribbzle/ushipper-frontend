import React, { useCallback } from 'react';

import { OfferStatusesEnum } from '@/enums';
import { useMeCarrier } from '@hooks';
import { OrderOffer } from '@store/api/order-offers';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

import { OfferItemActions } from './offer-item-actions';

import './offer-item-right.scss';

const t = translateByNamespace('client:order-offers');
const cn = classname('offer-item-right');

type Props = {
    offer: OrderOffer;
};

export const OfferItemRight = ({ offer }: Props) => {
    const isMeCarrier = useMeCarrier();
    const { shipperCompany, carrierCompany, createdAt, acceptedAt, status, declinedAt } = offer;

    const handleShowCompanyPage = useCallback((companyId: string) => {
        const aliasPath = `/companies/${companyId}`;

        window.open(aliasPath, '_blank');
    }, []);

    return (
        <div className={cn()}>
            <OfferItemActions offer={offer} />
            {isMeCarrier ? (
                <div className={cn('meta')}>
                    {t('item:sent-by')} <strong onClick={() => handleShowCompanyPage(shipperCompany.publicId)}>{shipperCompany.name}</strong>{' '}
                    {diffForHumans(new Date(createdAt))}
                </div>
            ) : (
                <div className={cn('meta')}>
                    {t('item:sent')} <strong onClick={() => handleShowCompanyPage(carrierCompany.publicId)}>{carrierCompany.name}</strong>{' '}
                    {diffForHumans(new Date(createdAt))}
                </div>
            )}
            {status === OfferStatusesEnum.ACCEPTED && acceptedAt && (
                <div className={cn('meta')}>
                    {t('item:accepted')} {diffForHumans(new Date(acceptedAt))}
                </div>
            )}
            {status === OfferStatusesEnum.DECLINED && declinedAt && (
                <div className={cn('meta')}>
                    {t('item:declined')} {diffForHumans(new Date(declinedAt))}
                </div>
            )}
        </div>
    );
};
