import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

import { InstantTermPaymentMethod, InstantTermPaymentType } from '@/enums';
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
