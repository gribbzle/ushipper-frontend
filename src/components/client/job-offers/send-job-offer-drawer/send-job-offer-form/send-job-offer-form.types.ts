import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

import { UserRoleType } from '@/enums';
import { Attachment } from '@/shared';
import { TermCondition } from '@store/client';

export type SendJobOfferFormProps = {
    initialValues: SendJobOfferFormValue;
    formRef: MutableRefObject<FormApi<SendJobOfferFormValue> | undefined>;
    onSubmit: (values: SendJobOfferFormValue) => void;
};

type BusinessHours = 'twenty_four_hours' | 'full_time' | 'part_time';

export type SendJobOfferFormValue = {
    roleType?: UserRoleType;
    businessHours: BusinessHours;
    dispatchFee?: number;
    term: TermCondition;
    startDate: string;
    description: string;
    attachments: (File | Attachment)[];
};
