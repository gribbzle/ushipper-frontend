import React from 'react';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { TransportServiceSelect } from '@/components/common/transport-service-select/transport-service-select';
import { Paper } from '@/components/common/paper/paper';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { useBusinessInfoCard } from './use-business-info-card';
import { useInitialValuesBusinessInfoCard } from './use-initial-values-business-info-card';

const t = translateByNamespace('client:company-settings');
const tFields = translateByNamespace('client:profile-settings.business-info.fields');
const tTitle = translateByNamespace('client:profile-settings.business-info');
const loadboardT = translateByNamespace('client:loadboard-filters');
const cn = classname('company-settings-page');
const formId = 'businessInfoCardFormId';

export const BusinessInfoCard = () => {
    const { initialValues } = useInitialValuesBusinessInfoCard();
    const { onChangeHandler, handleSubmit, disabledSubmit, formRef } = useBusinessInfoCard();

    return (
        <Paper
            title={tTitle('title')}
            bodyClassName={cn('business-info-card')}
            body={
                <Form
                    subscription={{ values: true }}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit, form }) => {
                        formRef.current = form;

                        return (
                            <form className={cn('business-info-form')} onSubmit={handleSubmit} id={formId}>
                                <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                                <FormControl>
                                    <InputLabel>{tFields('specialization')} </InputLabel>
                                    <Field<number[]> name='specializations' component={TransportServiceSelect} placeholder='' />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{t('fields.working-time')} </InputLabel>
                                    <Field name='businessHours' component={TextField} placeholder='' />
                                </FormControl>
                            </form>
                        );
                    }}
                />
            }
            footer={
                <div>
                    <Button disabled={disabledSubmit} view='primary' type='submit' form={formId}>
                        {loadboardT('save')}
                    </Button>
                </div>
            }
        />
    );
};
