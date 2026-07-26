import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { Button, CloseButton, Popup } from '@components';
import { FormControl, InputLabel, TextField } from '@fields';
import { translateByNamespace } from '@utils';
import { required } from '@validators';

import { useCancelRollbackTransactionPopup } from './use-cancel-rollback-transaction-popup';

const t = translateByNamespace('admin:accounting:balance-table:cancel-rollback-transaction-popup');

export type CancelRollbackTransactionFormState = {
    cancellationNotes: string;
};

export const CancelRollbackTransactionPopup = () => {
    const { handleCancelRollbackTransactionClick, handleSubmit, handleClose, mode, isLoading, isPopupOpened, formRef } = useCancelRollbackTransactionPopup();

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='danger' onClick={handleCancelRollbackTransactionClick} disabled={isLoading}>
                    {t(mode)}
                </Button>
                <CloseButton onClick={handleClose} disabled={isLoading} />
            </>
        ),
        [handleClose, handleCancelRollbackTransactionClick, mode, isLoading],
    );

    const description = useMemo(
        () => (
            <Form<CancelRollbackTransactionFormState>
                initialValues={{}}
                onSubmit={handleSubmit}
                render={({ form, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <InputLabel required={true}>{t(`${mode}-notes-label`)}</InputLabel>
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
        [handleSubmit, formRef, mode],
    );

    return <Popup isOpen={isPopupOpened} onClose={handleClose} title={t(`${mode}-title`)} description={description} actions={actions} />;
};
