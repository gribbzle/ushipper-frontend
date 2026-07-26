import { useCallback, useRef, useState } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch } from '@store';
import { loadboardActions } from '@store/client/loadboard';

export type AssignDriverFormState = {
    assignedDriverIds: string[];
    externalAssignedDriverId: string;
    note: string;
};

export const useAssignDriverForm = () => {
    const [isAssignDriver, setIsAssignDriver] = useState(false);
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<AssignDriverFormState>>();

    const onChangeIsAssignDriver = useCallback(
        (checked: boolean) => {
            setIsAssignDriver(checked);
            dispatch(loadboardActions.setCheckingContractPopup({ assignedDriverId: null, note: null, externalAssignedDriverId: null }));
            formRef.current?.reset();
        },
        [setIsAssignDriver, dispatch],
    );

    const onChangeFormValue = useCallback(
        ({ assignedDriverIds, note, externalAssignedDriverId }: AssignDriverFormState) => {
            dispatch(
                loadboardActions.setCheckingContractPopup({
                    assignedDriverId: assignedDriverIds[0] || null,
                    note: note || null,
                    externalAssignedDriverId: externalAssignedDriverId || null,
                }),
            );
        },
        [dispatch],
    );

    return { onChangeFormValue, onChangeIsAssignDriver, isAssignDriver, formRef };
};
