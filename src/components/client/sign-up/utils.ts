import { SignUpFormState } from '@store/client';
import { transformFormValuesToSpecializations } from '@utils/specialization';

export const prepareSignUpPayload = (values: SignUpFormState) => {
    const specializations = transformFormValuesToSpecializations(values);

    if (specializations.length) {
        const payload: any = {
            ...values,
            specializations,
        };

        values.specializations.forEach((specializationId: number) => {
            delete payload[`category-${specializationId}`];
        });

        return payload;
    }

    return values;
};
