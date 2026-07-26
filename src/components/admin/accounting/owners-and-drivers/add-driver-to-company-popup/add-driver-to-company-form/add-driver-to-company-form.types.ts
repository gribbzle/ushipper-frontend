import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type AddDriverToCompanyFormState = {
    name: string;
    email: string;
    roleId: number;
    companyId?: string;
    parentUserId?: string;
};

export type AddDriverToCompanyFormProps = {
    formRef: MutableRefObject<FormApi<AddDriverToCompanyFormState> | undefined>;
    onAfterSubmit: () => void;
};
