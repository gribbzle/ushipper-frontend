import { FormEvent, useCallback } from 'react';
import { FormApi } from 'final-form';

export const useFormSubmit = <T>() => {
    const formSubmit = useCallback((form: FormApi<T>, e: FormEvent) => {
        e.preventDefault();
        const errors = form.getState().errors;

        if (errors && Object.keys(errors).length > 0) {
            const errorElement = document.querySelector('.form-helper-text--error');

            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        form.submit();
    }, []);

    return { formSubmit };
};
