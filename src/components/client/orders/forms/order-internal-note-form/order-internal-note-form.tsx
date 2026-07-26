import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { Button } from '@/components';
import { StringInput } from '@fields';
import { useAppSelector } from '@store';
import { OrderInternalNoteFormState, useCreateOrderInternalNoteMutation } from '@store/api/order-internal-notes-api';
import { orderPublicIdSelector } from '@store/client';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import './order-internal-note-form.scss';

const notifications = translateByNamespace('client:order:notifications');
const t = translateByNamespace('client:order:internal-notes');
const cn = classname('order-internal-note-form');

export const OrderInternalNoteForm = () => {
    const orderId = useAppSelector(orderPublicIdSelector) as string;
    const [createInternalNote] = useCreateOrderInternalNoteMutation();

    const handleFormSubmit = useCallback(
        async (values: OrderInternalNoteFormState) => {
            createInternalNote({ orderId, text: values.text })
                .unwrap()
                .then(() => {
                    toast.success(notifications<string>('create-internal-note-success'));
                })
                .catch(() => {
                    toast.error(notifications<string>('create-internal-note-error'));
                });
        },
        [createInternalNote, orderId],
    );

    return (
        <Form<OrderInternalNoteFormState>
            onSubmit={handleFormSubmit}
            render={({ handleSubmit }) => (
                <form className={cn()} onSubmit={handleSubmit}>
                    <Field validate={required} required={true} name='text' component={StringInput} />
                    <Button type='submit' size='small' view='plain-primary'>
                        {t('add-note')}
                    </Button>
                </form>
            )}
        />
    );
};
