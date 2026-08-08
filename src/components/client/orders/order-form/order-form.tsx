import React, { ReactNode, useCallback } from 'react';
import cleanDeep from 'clean-deep';
import { Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { useAppSelector } from '@store';
import { useUpdateOrderPaymentMutation } from '@store/api/order-payment-api';
import { useUpdateOrderMutation } from '@store/api/orders-api';
import { OrderFormState, orderPublicIdSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { preparePaymentInformation } from '@utils/orders/prepare-payment-information';

const cn = classname('order-form');
const t = translateByNamespace('client:order:notifications');

type FormProps = {
    id?: string;
    initialValues?: OrderFormState;
    children: ReactNode;
    className?: string;
    afterSubmit?: () => void;
};

const ReactFinalForm = ({ children, initialValues = {}, afterSubmit, ...rest }: FormProps) => {
    const orderId = useAppSelector(orderPublicIdSelector);
    const [updateOrder] = useUpdateOrderMutation();
    const [updatePayment] = useUpdateOrderPaymentMutation();

    const handleFormSubmit = useCallback(
        async (values: OrderFormState) => {
            if (!orderId) {
                return;
            }
            const { payment, ...restValues } = values;
            const orderValues = {
                ...restValues,
                ...(restValues.paymentInformation ? { paymentInformation: preparePaymentInformation(restValues.paymentInformation) } : {}),
            };

            try {
                if (payment) {
                    await updatePayment(cleanDeep({ ...payment, orderId })).unwrap();
                }

                await updateOrder({ ...orderValues, publicId: orderId }).unwrap();
                toast.success(t<string>('updated'));
                afterSubmit?.();
            } catch {
                toast.error(t<string>('update-error'));
            }
        },
        [afterSubmit, orderId, updateOrder, updatePayment],
    );

    return (
        <Form
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            subscription={{ values: true }}
            render={({ handleSubmit }) => (
                <form autoComplete='off' onSubmit={handleSubmit} {...rest}>
                    {children}
                </form>
            )}
        />
    );
};

type OrderFormProps = React.FormHTMLAttributes<HTMLFormElement | HTMLDivElement> & {
    id?: string;
    component?: 'form' | 'div';
    children: ReactNode;
    className?: string;
    initialValues?: OrderFormState;
    afterSubmit?: () => void;
};

export const OrderForm = (props: OrderFormProps) => {
    const { component = 'form', className, children, initialValues, afterSubmit, ...rest } = props;

    if (component === 'form') {
        return (
            <ReactFinalForm className={className} initialValues={initialValues} afterSubmit={afterSubmit} {...rest}>
                {children}
            </ReactFinalForm>
        );
    }

    return (
        <div className={cn('', [className])} {...rest}>
            {children}
        </div>
    );
};
