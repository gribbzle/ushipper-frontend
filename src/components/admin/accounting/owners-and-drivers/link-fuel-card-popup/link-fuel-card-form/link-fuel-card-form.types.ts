import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type LinkFuelCardFormState = {
    fuelCardId: number;
};

export type LinkFuelCardFormProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<LinkFuelCardFormState> | undefined>;
};
