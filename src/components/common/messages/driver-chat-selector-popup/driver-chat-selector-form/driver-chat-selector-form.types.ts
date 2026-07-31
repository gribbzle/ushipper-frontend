import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type DriverSelectorFormState = {
    driverId: string;
};

export type DriverSelectorFormStateProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<DriverSelectorFormState> | undefined>;
};
