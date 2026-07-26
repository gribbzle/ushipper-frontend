import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { OfferActionModal } from '@/components';
import { DeclinationJobOfferReasonsEnum } from '@/enums/declination-reasons-enum';
import { FormControl, InputLabel, LabeledCheckboxInput, TextField } from '@fields';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import { DeclineJobOfferFormState } from './decline-job-offer-modal.types';
import { useDeclineJobOfferModal } from './use-decline-job-offer-modal';

import './decline-job-offer-modal.scss';

const t = translateByNamespace('client:order-offers:decline-popup');
const cn = classname('decline-job-offer-modal');

export const DeclineJobOfferModal = () => {
    const { onCloseHandler, declineJobOffer, handleSubmit, router, formRef } = useDeclineJobOfferModal();

    const body = useMemo(
        () => (
            <Form<DeclineJobOfferFormState>
                initialValues={{
                    [DeclinationJobOfferReasonsEnum.LowSalary]: false,
                    [DeclinationJobOfferReasonsEnum.PersonalReason]: false,
                    declineComment: null,
                }}
                onSubmit={handleSubmit}
                render={({ handleSubmit, form }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit} className={cn('form')}>
                            <div className={cn('form-checkboxes')}>
                                <Field
                                    name={DeclinationJobOfferReasonsEnum.LowSalary}
                                    label={t('low-salary')}
                                    component={LabeledCheckboxInput}
                                    validate={required}
                                />
                                <Field
                                    name={DeclinationJobOfferReasonsEnum.PersonalReason}
                                    label={t('personal-reason')}
                                    component={LabeledCheckboxInput}
                                    validate={required}
                                />
                            </div>
                            <FormControl>
                                <InputLabel>{t('comment')}</InputLabel>
                                <Field component={TextField} name='declineComment' multiline={true} parse={value => value} />
                            </FormControl>
                        </form>
                    );
                }}
            />
        ),
        [formRef, handleSubmit],
    );

    return (
        <OfferActionModal
            type='decline'
            onClose={onCloseHandler}
            onAction={declineJobOffer}
            isOpen={!!router.query.openDeclineJobOfferId}
            title={t('job-offer-title')}
        >
            {body}
        </OfferActionModal>
    );
};
