import React from 'react';

import { Button } from '@/components/common/button/button';
import { FlagButton } from '@/components/common/flag-button/flag-button';
import { useIsDispatcherOwnerPage, useIsDriverOwnerPage } from '@/hooks/catalogs/use-type-company-owner';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useOpenSendJobOfferDrawer } from '@/components/client/job-offers/send-job-offer-drawer/send-job-offer-form/use-open-send-job-offer-drawer';

import { CompanyBriefActionsProps } from './company-brief-actions.types';
import { useCompanyBriefActions } from './use-company-brief-actions';

import './company-brief-actions.scss';
import HireIcon from '@/assets/icons/hire-icon.svg';
import MessageTextLeftIcon from '@/assets/icons/message-text-left.svg';

const cn = classname('company-brief-actions');
const t = translateByNamespace('client:company-page.brief');

export const CompanyBriefActions = ({ id, name, isFlagged }: CompanyBriefActionsProps) => {
    const { handleOpenDrawer } = useOpenSendJobOfferDrawer();
    const isDispatcherOwnerPage = useIsDispatcherOwnerPage();
    const isDriverOwnerPage = useIsDriverOwnerPage();
    const { handleFlaggedClick, handleUnFlaggedClick } = useCompanyBriefActions(id);

    return (
        <div className={cn('')}>
            <Button size='medium' view='primary' onClick={() => handleOpenDrawer(id, name)}>
                <HireIcon />
                {t(`${isDispatcherOwnerPage || isDriverOwnerPage ? 'hire' : 'send-offer'}`)}
            </Button>
            <Button size='medium'>
                <MessageTextLeftIcon />
                {t('message')}
            </Button>
            <FlagButton isFlagged={isFlagged} handleMarkAsFlaggedClick={handleFlaggedClick} handleMarkAsUnFlaggedClick={handleUnFlaggedClick} />
        </div>
    );
};
