import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import {DatePicker} from '@/fields/datepicker';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, required } from '@validators';

import { HasPeriodRadioGroup } from './has-period-type-radio-group';
import { ReportFormValue } from './report-popup.types';
import { useReportPopup } from './use-report-popup';

import './report-popup.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:report-popup');
const cn = classname('report-popup');

export const ReportPopup = () => {
    const {
        onClosePopupHandler,
        onSubmitHandler,
        makeReportHandler,
        onChangeHandler,
        name,
        initialValues,
        isPopupOpened,
        formRef,
        isCashOutReport,
        currentContext,
        isLoading,
    } = useReportPopup();

    const description = useMemo(
        () => (
            <Form<ReportFormValue>
                initialValues={initialValues}
                subscription={{ values: true }}
                onSubmit={makeReportHandler}
                validate={currentContext?.validate}
                render={({ form, values: { hasPeriod }, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit} className={cn('form')}>
                            <FormValuesSpy onChange={onChangeHandler} debounceTime={100} />
                            {isCashOutReport && <HasPeriodRadioGroup name='hasPeriod' />}
                            {(!isCashOutReport || hasPeriod === 'custom') && (
                                <>
                                    {isCashOutReport && <InputLabel className={cn('form-period')}>{t('form:period')}:</InputLabel>}
                                    <FormControl>
                                        <InputLabel required={true}>{t('form:start-date')}</InputLabel>
                                        <Field
                                            name='startDate'
                                            component={DatePicker}
                                            validate={composeValidators(required)}
                                            parse={value => value}
                                            placeholder={t('form:select-date')}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel required={true}>{t('form:end-date')}</InputLabel>
                                        <Field
                                            name='endDate'
                                            component={DatePicker}
                                            validate={composeValidators(required)}
                                            parse={value => value}
                                            placeholder={t('form:select-date')}
                                        />
                                    </FormControl>
                                </>
                            )}
                        </form>
                    );
                }}
            />
        ),
        [makeReportHandler, onChangeHandler, initialValues, isCashOutReport, formRef, currentContext?.validate],
    );

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='primary' onClick={onSubmitHandler} hasLoader={isLoading}>
                    {t('make-report-option')}
                </Button>
                <Button size='small' onClick={onClosePopupHandler} disabled={isLoading}>
                    {t('cancel-action')}
                </Button>
            </>
        ),
        [onSubmitHandler, onClosePopupHandler, isLoading],
    );

    if (!currentContext) {
        return null;
    }

    return (
        <Popup
            onTop={true}
            isOpen={isPopupOpened}
            onClose={onClosePopupHandler}
            title={t(currentContext.titleKey, { name: name ?? t('default-title') })}
            description={description}
            actions={actions}
            isClickOutside={!isLoading}
            size='medium'
            className={cn('')}
        />
    );
};
