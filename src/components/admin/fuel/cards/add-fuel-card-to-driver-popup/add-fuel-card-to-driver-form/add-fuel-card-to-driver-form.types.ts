import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type AddFuelCardToDriverFormState = {
    accountId: string;
};

export type AddFuelCardToDriverFormProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<AddFuelCardToDriverFormState> | undefined>;
};
