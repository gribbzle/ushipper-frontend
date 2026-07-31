import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type EditFuelCardFormState = {
    limit?: number;
    limitDef?: number;
    hasLimit: boolean;
};

export type EditFuelCardToDriverFormProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<EditFuelCardFormState> | undefined>;
};
