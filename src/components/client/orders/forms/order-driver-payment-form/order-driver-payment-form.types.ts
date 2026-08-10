import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { InstantTermPaymentMethod } from '@/store/common/orders/types';
import { Attachment } from '@/shared';
import { OrderDriverPaymentFormState } from '@store/client';

export type OrderDriverPaymentFormProps = {
    instantTermPaymentType: InstantTermPaymentType | null;
    instantTermPaymentMethod?: InstantTermPaymentMethod | null;
    orderId: string | null;
    file: Attachment | null;
    formRef: MutableRefObject<FormApi<OrderDriverPaymentFormState> | undefined>;
    onAfterFormSubmit: () => void;
};
