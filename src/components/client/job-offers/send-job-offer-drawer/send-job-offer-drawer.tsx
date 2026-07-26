import React from 'react';
import { useSelector } from 'react-redux';

import { Button, Drawer } from '@components';
import { sendJobOfferDrawerSelector } from '@store/client/job-offers/selectors';
import { translateByNamespace } from '@utils';

import { SendJobOfferForm } from './send-job-offer-form/send-job-offer-form';
import { useSendJobOfferDrawer } from './send-job-offer-form/use-send-job-offer-drawer';

const t = translateByNamespace('client:send-job-offer');

export const SendJobOfferDrawer = () => {
    const { initialValues, formRef, isDrawerOpened, handleSubmitClick, onSubmit, handleCloseDrawer } = useSendJobOfferDrawer();
    const { to } = useSelector(sendJobOfferDrawerSelector);

    return (
        <Drawer
            isOpen={isDrawerOpened}
            onClose={handleCloseDrawer}
            head={t('title', { name: to || '' })}
            body={<SendJobOfferForm formRef={formRef} onSubmit={onSubmit} initialValues={initialValues} />}
            actions={
                <Button view='primary' onClick={handleSubmitClick}>
                    {t('send')}
                </Button>
            }
        />
    );
};
