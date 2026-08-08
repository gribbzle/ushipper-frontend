import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { NullableFields } from '@/shared';
import { StringInput } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderInternalNote, useCreateOrderInternalNoteMutation, useUpdateOrderInternalNoteMutation } from '@store/api/order-internal-notes-api';
import { createEditInternalNotePopupPropsSelector, ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './create-edit-order-internal-note-popup.scss';

const cn = classname('create-edit-order-internal-note-popup');
const t = translateByNamespace('client:order:internal-notes');

type InternalNoteFormState = NullableFields<{
    internalNote: string;
}>;

type Props = {
    onEditComplete?: (internalNote: OrderInternalNote) => void;
    onCreateComplete?: (internalNote: OrderInternalNote) => void;
};

export const CreateEditOrderInternalNotePopup = ({ onEditComplete, onCreateComplete }: Props) => {
    const dispatch = useAppDispatch();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const formRef = useRef<FormApi<InternalNoteFormState>>();
    const { isVisible, publicOrderId, internalNoteId, initialText, mode } = useAppSelector(createEditInternalNotePopupPropsSelector);
    const [createInternalNote, { isLoading: isCreateInternalNoteLoading }] = useCreateOrderInternalNoteMutation();
    const [updateOrderInternalNote, { isLoading: isEditInternalNoteLoading }] = useUpdateOrderInternalNoteMutation();

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setCreateEditInternalNoteModalProps({ isVisible: false, publicOrderId: null, internalNoteId: null, initialText: '', mode: null }),
        );
    }, [dispatch]);

    const handleConfirmClick = useCallback(() => {
        formRef.current?.submit();
    }, []);

    const handleSubmit = useCallback(
        async (values: InternalNoteFormState) => {
            if (publicOrderId && values.internalNote && mode === 'create') {
                createInternalNote({ orderId: publicOrderId, text: values.internalNote })
                    .unwrap()
                    .then(internalNote => {
                        if (onCreateComplete) {
                            onCreateComplete(internalNote);
                        }
                        handleClose();
                        toast.success(t('create-internal-note-popup.create-internal-note-success') as string);
                    })
                    .catch(() => {
                        toast.error(t('create-internal-note-popup.create-internal-note-error') as string);
                    });
            } else if (publicOrderId && internalNoteId && values.internalNote && mode === 'edit') {
                updateOrderInternalNote({ orderId: publicOrderId, internalNoteId, text: values.internalNote })
                    .unwrap()
                    .then(internalNote => {
                        if (onEditComplete) {
                            onEditComplete(internalNote);
                        }
                        handleClose();
                        toast.success(t('edit-internal-note-popup.edit-internal-note-success') as string);
                    })
                    .catch(() => {
                        toast.error(t('edit-internal-note-popup.edit-internal-note-error') as string);
                    });
            }
        },
        [createInternalNote, handleClose, internalNoteId, mode, onCreateComplete, onEditComplete, publicOrderId, updateOrderInternalNote],
    );

  const handleChangeInternalNote = useCallback((value: string) => {
    setIsSubmitDisabled(!!value);
    }, []);

    const initialValues = useMemo(() => {
        return {
            internalNote: initialText ?? null,
        };
    }, [initialText]);

    const actions = useMemo(
        () => (
            <>
                <Button
                    size='small'
                    view='primary'
                    disabled={(!isSubmitDisabled && isCreateInternalNoteLoading) || isEditInternalNoteLoading}
                    onClick={handleConfirmClick}
                >
                    {t(`${mode}-internal-note-popup.confirm-button-label`)}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {t(`${mode}-internal-note-popup.cancel-button-label`)}
                </Button>
            </>
        ),
        [handleClose, handleConfirmClick, isCreateInternalNoteLoading, isEditInternalNoteLoading, isSubmitDisabled, mode],
    );

    const description = useMemo(
        () => (
            <Form<InternalNoteFormState>
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={({ form, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit}>
                            <Field required={true} name='internalNote' onChangeText={handleChangeInternalNote} component={StringInput} textarea={true} />
                        </form>
                    );
                }}
            />
        ),
        [handleChangeInternalNote, handleSubmit, initialValues],
    );

    return (
        <Popup
            isOpen={isVisible}
            onClose={handleClose}
            title={t(`${mode}-internal-note-popup.title`)}
            description={description}
            className={cn()}
            actions={actions}
        />
    );
};
