import { useCallback } from 'react';
import { useForm } from 'react-final-form';

export const useIsPartnerSwitch = () => {
    const { batch, change } = useForm();

    const handleIsPartnerSwitchChange = useCallback(
        (value: boolean) => {
            if (!value) {
                batch(() => {
                    change('fees', []);
                    change('deletedFees', []);
                });
            }
        },
        [batch, change],
    );

    return {
        handleIsPartnerSwitchChange,
    };
};
