import React from 'react';
import { useRouter } from 'next/router';
import { Field, Form } from 'react-final-form';

import { OfferActionModal } from '@/components/common/offer-action-modal/offer-action-modal';
import { UserRoleType } from '@/enums';
import {FormControl} from '@/fields/form-control';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { useRolesOptions } from '../send-job-offer-drawer/send-job-offer-form/use-roles-options';

import { AcceptJobOfferFormValue } from './accept-job-offer-modal.types';
import { useAcceptJobOfferModal } from './use-accept-job-offer-modal';

const t = translateByNamespace('client:order-offers:action-modal');

export const AcceptJobOfferModal = () => {
    const { formRef, handleAction, handleClose, handleSubmit, jobOffer } = useAcceptJobOfferModal();

    const isJobOfferForDriver = jobOffer?.receiver.roleName === 'DriverOwner';

    const rolesOptions = useRolesOptions('type', isJobOfferForDriver ? UserRoleType.CARRIER_DRIVER : UserRoleType.CARRIER_DISPATCHER);

    const router = useRouter();

    return (
        <OfferActionModal
            type='accept'
            onClose={handleClose}
            onAction={handleAction}
            isOpen={!!router.query.openAcceptJobOfferId}
            title={t('accept-description')}
        >
            <Form<AcceptJobOfferFormValue>
                subscription={{ values: true }}
                onSubmit={handleSubmit}
                render={({ form }) => {
                    formRef.current = form;

                    return (
                        <form>
                            <FormControl>
                                <Field name='roleType' component={SelectField} options={rolesOptions} validate={required} isClearable={false} placeholder='' />
                            </FormControl>
                        </form>
                    );
                }}
            />
        </OfferActionModal>
    );
};
