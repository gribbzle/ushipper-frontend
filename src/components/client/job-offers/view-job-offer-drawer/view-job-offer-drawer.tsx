import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { OfferDrawerTabs } from '@/components/common/offer-drawer-tabs/offer-drawer-tabs';
import { OfferStatusesEnum } from '@/enums';
import { CheckIcon, CloseIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { OfferTabsEnum } from '../../offers/offer-drawer/offer-drawer';

import { JobOfferDetails } from './job-offer-details/job-offer-details';
import { JobOfferChat } from './job-offer-chat';
import { useViewJobOfferDrawer } from './use-view-job-offer-drawer';
import { useViewJobOfferDrawerActions } from './use-view-job-offer-drawer-actions';

import './view-job-offer-drawer.scss';

const t = translateByNamespace('client:order-offers');
const tTitle = translateByNamespace('client:job-offers-page.drawer');
const cn = classname('view-job-offer-drawer');

export const ViewJobOfferDrawer = () => {
    const { router, jobOffer, isDrawerOpened, selectedTab, hideActions, onSelectTabHandler, handleCloseDrawer } = useViewJobOfferDrawer();
    const { isMeSender, handleJobOfferStatusChange, openDeclinationModal, handleJobOfferEdit, handleAccept } = useViewJobOfferDrawerActions();

    const SenderActions = useMemo(
        () => (
            <div className={cn('actions')}>
                <Button view='danger' onClick={() => handleJobOfferStatusChange(OfferStatusesEnum.CANCELED)}>
                    {t('drawer:close-offer')}
                </Button>
                <Button onClick={handleJobOfferEdit}>{t('drawer:edit-offer')}</Button>
            </div>
        ),
        [handleJobOfferEdit, handleJobOfferStatusChange],
    );

    const ReceiverActions = useMemo(
        () => (
            <div className={cn('actions')}>
                <Button view='danger' onClick={openDeclinationModal}>
                    <CloseIcon /> {t('drawer:decline-offer')}
                </Button>
                <Button view='primary' onClick={handleAccept}>
                    <CheckIcon /> {t('item:accept-offer')}
                </Button>
            </div>
        ),
        [handleAccept, openDeclinationModal],
    );

    return (
        <Drawer
            isOpen={!!router.query.drawerJobOfferId}
            onClose={handleCloseDrawer}
            onTop={isDrawerOpened}
            head={tTitle('title')}
            bodyClassName={cn('body')}
            actionsClassName={cn('footer')}
            body={
                <>
                    {jobOffer && (
                        <>
                            <OfferDrawerTabs onSelectTab={onSelectTabHandler} queryTab={router.query.tab} />
                            {selectedTab === OfferTabsEnum.details && <>{jobOffer && <JobOfferDetails jobOffer={jobOffer} />}</>}
                            {selectedTab === OfferTabsEnum.message && <JobOfferChat jobOfferPublicId={jobOffer.publicId} jobOffersStatus={jobOffer.status} />}
                        </>
                    )}
                </>
            }
            actions={hideActions && <>{isMeSender ? SenderActions : ReceiverActions}</>}
        />
    );
};
