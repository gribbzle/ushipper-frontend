import React from 'react';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';
import { Button } from '@components';
import { classname, translateByNamespace } from '@utils';

import { useJobOfferActions } from './use-job-offer-actions';

import './job-offer-item-actions.scss';

const cn = classname('job-offer-item-actions');
const t = translateByNamespace('client:order-offers:item');

export const JobOfferItemActions = ({ jobOfferPublicId }: { jobOfferPublicId?: string }) => {
    const { handleOpenViewJobOfferDrawer } = useJobOfferActions(jobOfferPublicId);

    return (
        <div className={cn()}>
            <Button size='small' onClick={() => handleOpenViewJobOfferDrawer(OfferTabsEnum.details)}>
                {t('view-offer')}
            </Button>
            <Button size='small' onClick={() => handleOpenViewJobOfferDrawer(OfferTabsEnum.message)}>
                {t('message')}
            </Button>
        </div>
    );
};
