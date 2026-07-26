import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import { useEffectOnce } from '@hooks';
import { useAppDispatch } from '@store';
import { staffActions } from '@store/common/staff/slice';

import { getStaffUrlParams } from './get-staff-url-params';
import { StaffFiltersFormState } from './staff-filters.types';

export const useStaffFiltersForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const isFirstRenderRef = useRef(true);
    const formRef = useRef<FormApi<StaffFiltersFormState>>();

    const onChangeHandler = useCallback(
        (values: StaffFiltersFormState) => {
            if (isFirstRenderRef.current) {
                isFirstRenderRef.current = false;

                return;
            }

            const { name, phone, roleId, status, email, companyName } = values;

            dispatch(
                staffActions.setFilters({
                    page: 1,
                    name: name ?? null,
                    phone: phone ?? null,
                    roleId: roleId ?? null,
                    status: status ?? null,
                    email: email ?? null,
                    companyName: companyName ?? null,
                }),
            );

            router.replace(
                {
                    query: getStaffUrlParams(values, router.query),
                },
                {
                    pathname,
                    query: getStaffUrlParams(values, router.query),
                },
                {
                    shallow: true,
                },
            );
        },
        [dispatch, router, pathname],
    );

    const getInitialFormStateFromUrlParams = (): StaffFiltersFormState => {
        const { name, phone, roleId, status, email, companyName } = router.query;
        const formState: StaffFiltersFormState = {};

        if (name && typeof name === 'string') {
            formState.name = name;
        }
        if (phone && typeof phone === 'string') {
            formState.phone = phone;
        }
        if (email && typeof email === 'string') {
            formState.email = email;
        }
        if (roleId && typeof roleId === 'string') {
            formState.roleId = Number(roleId);
        }
        if (status && typeof status === 'string') {
            formState.status = status;
        }
        if (companyName && typeof companyName === 'string') {
            formState.companyName = companyName;
        }

        return formState;
    };

    useEffectOnce(() => {
        formRef.current?.initialize(getInitialFormStateFromUrlParams());
    });

    return { formRef, onChangeHandler };
};
