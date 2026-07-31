import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';

import { StringInput } from '@fields';
import { useAppDispatch } from '@store';
import { OrderFormEnum, orderSendBOLAction, OrderSendBOLFormState } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, emailValidator, required } from '@validators';

import './order-send-bol-form.scss';

const t = translateByNamespace('client:order:send-bol:fields');
const cn = classname('order-send-bol-form');

type Props = {
    orderId: string | null;
    onAfterFormSubmit: () => void;
};

export const OrderSendBOLForm = ({ orderId, onAfterFormSubmit }: Props) => {
    const dispatch = useAppDispatch();

    const handleFormSubmit = useCallback(
        async (values: OrderSendBOLFormState) => {
            if (orderId) {
                dispatch(
                    orderSendBOLAction({
                        orderId,
                        data: values,
                    }),
                );
            }

            onAfterFormSubmit();
        },
        [dispatch, onAfterFormSubmit, orderId],
    );

    return (
        <Form<OrderSendBOLFormState>
            onSubmit={handleFormSubmit}
            render={({ handleSubmit }) => (
                <form className={cn()} id={OrderFormEnum.SEND_BOL} onSubmit={handleSubmit} autoComplete='off'>
                    <Field
                        name='email'
                        label={t('email-label')}
                        placeholder={t('email-placeholder')}
                        component={StringInput}
                        validate={composeValidators(required, emailValidator)}
                        required={true}
                        parse={value => value}
                    />
                </form>
            )}
        />
    );
};
