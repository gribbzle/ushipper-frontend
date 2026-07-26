import React from 'react';

import { Button, FlagButton } from '@/components/common';
import { useIsDispatcherOwnerPage, useIsDriverOwnerPage } from '@hooks';
import { HireIcon, MessageTextLeftIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import { useOpenSendJobOfferDrawer } from '../../job-offers';

import { CompanyBriefActionsProps } from './company-brief-actions.types';
import { useCompanyBriefActions } from './use-company-brief-actions';

import './company-brief-actions.scss';

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
