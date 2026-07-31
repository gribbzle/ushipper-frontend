import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type CreateWalletFormState = {
    name: string;
};

export type CreateWalletFormProps = {
    formRef: MutableRefObject<FormApi<CreateWalletFormState> | undefined>;
    onAfterSubmit: () => void;
};
