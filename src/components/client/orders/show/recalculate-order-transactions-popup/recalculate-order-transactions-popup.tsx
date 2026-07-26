import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { Button, CloseButton, Popup } from '@components';
import { FormControl, InputLabel, TextField } from '@fields';
import { translateByNamespace } from '@utils';
import { required } from '@validators';

import { useRecalculateOrderTransactionsPopup } from './use-recalculate-order-transactions-popup';

const t = translateByNamespace('client:order:payment-information:recalculate-order-transactions-popup');

export type RecalculateOrderTransactionsFormState = {
    cancellationNotes: string;
};

export const RecalculateTransactionsPopup = () => {
    const { handleCancelRollbackTransactionClick, handleSubmit, handleClose, title, isLoading, isVisible, formRef } = useRecalculateOrderTransactionsPopup();

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='danger' onClick={handleCancelRollbackTransactionClick} disabled={isLoading}>
                    {t('recalculate')}
                </Button>
                <CloseButton onClick={handleClose} disabled={isLoading} />
            </>
        ),
        [handleClose, handleCancelRollbackTransactionClick, isLoading],
    );

    const description = useMemo(
        () => (
            <Form<RecalculateOrderTransactionsFormState>
                initialValues={{}}
                onSubmit={handleSubmit}
                render={({ form, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <InputLabel required={true}>{t('recalculate-notes-label')}</InputLabel>
                                <Field
                                    name='cancellationNotes'
                                    component={TextField}
                                    multiline={true}
                                    resize='none'
                                    validate={required}
                                    parse={value => value}
                                    placeholder=''
                                />
                            </FormControl>
                        </form>
                    );
                }}
            />
        ),
        [handleSubmit, formRef],
    );

    return <Popup isOpen={isVisible} onClose={handleClose} title={title} description={description} actions={actions} />;
};
