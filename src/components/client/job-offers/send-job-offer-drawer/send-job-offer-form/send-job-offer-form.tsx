import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useSelector } from 'react-redux';

import { UserRoleType } from '@/enums';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { WorkingTimeSelectionButtonGroup } from '@components';
import { DatePicker, FormControl, InputLabel, SelectField, TextField } from '@fields';
import { useIsDriverOwnerPage, useMeDispatcher, useMeDriver } from '@hooks';
import { sendJobOfferDrawerSelector } from '@store/client/job-offers/selectors';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import { SendJobOfferAttachmentField } from './send-job-offer-attachment-field';
import { SendJobOfferFormProps, SendJobOfferFormValue } from './send-job-offer-form.types';
import { useRolesOptions } from './use-roles-options';
import { useTermsOptions } from './use-terms-options';

import './send-job-offer-form.scss';

const tFields = translateByNamespace('client:profile-settings.business-info.fields');
const tSendJobOffer = translateByNamespace('client:send-job-offer');
const cn = classname('send-job-offer');

export const SendJobOfferForm = ({ initialValues, formRef, onSubmit }: SendJobOfferFormProps) => {
    const { jobOffer } = useSelector(sendJobOfferDrawerSelector);
    const isDriverOwnerPage = useIsDriverOwnerPage();

    const isJobOfferForDriver = isDriverOwnerPage || jobOffer?.receiver.roleName === 'DriverOwner';

    const rolesOptions = useRolesOptions('type', isJobOfferForDriver ? UserRoleType.CARRIER_DRIVER : UserRoleType.CARRIER_DISPATCHER);
    const termsOptions = useTermsOptions();
    const [areAttachmentsVisible, setAreAttachmentsVisible] = useState(false);
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();

    return (
        <Form<SendJobOfferFormValue>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn('form')}>
                        {!isMeDispatcher && !isMeDriver && (
                            <FormControl>
                                <InputLabel required={true}>{tSendJobOffer('form:role')}</InputLabel>
                                <Field name='roleType' component={SelectField} options={rolesOptions} validate={required} isClearable={false} placeholder='' />
                            </FormControl>
                        )}
                        <FormControl>
                            <InputLabel required={true}>{tSendJobOffer('form:time')}</InputLabel>
                            <WorkingTimeSelectionButtonGroup name='businessHours' validate={required} />
                        </FormControl>
                        <div className={cn('row')}>
                            {!isMeDriver && !isJobOfferForDriver && (
                                <FormControl>
                                    <InputLabel required={true}>{tFields('dispatch-fee')}</InputLabel>
                                    <Field type='number' name='dispatchFee' component={TextField} startAdornment='%' validate={required} />
                                </FormControl>
                            )}
                            <FormControl>
                                <InputLabel required={true}>{tFields('term')}</InputLabel>
                                <Field
                                    name='term'
                                    component={SelectField}
                                    options={termsOptions}
                                    validate={required}
                                    isClearable={false}
                                    displayAllOptions={true}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel required={true}>{tSendJobOffer('form:start-date')}</InputLabel>
                                <Field
                                    name='startDate'
                                    component={DatePicker}
                                    validate={required}
                                    parse={value => value}
                                    placeholder={tSendJobOffer('form:select-date')}
                                />
                            </FormControl>
                        </div>
                        <FormControl>
                            <InputLabel required={true}>{tSendJobOffer('form:specify-other')}</InputLabel>
                            <Field name='description' component={TextField} multiline={true} resize='none' validate={required} />
                        </FormControl>
                        <NativeSwitch label={tSendJobOffer('form:attach')} checked={areAttachmentsVisible} onChange={setAreAttachmentsVisible} />
                        {areAttachmentsVisible && <SendJobOfferAttachmentField />}
                    </form>
                );
            }}
        />
    );
};
