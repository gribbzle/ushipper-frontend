import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';

import { AdminFormOrdersFilters } from '@/types/order';

import { useOrdersFiltersChange, useOrdersSortingFieldOptions } from '../hooks';

import { AdminOrdersFiltersFormState, AdminOrdersFiltersProps } from './admin-orders-filters.types';
import { getAdminOrdersFiltersFromFormValue } from './utils';

export const useAdminOrdersFilters = ({ initialFilters, onFiltersChange }: AdminOrdersFiltersProps) => {
    const router = useRouter();
    const isFiltersFirstRenderRef = useRef(true);

    const handleFormSubmit = useCallback(() => undefined, []);

    const isCarriersOrdersPage = useMemo(() => router.pathname.includes('carrier'), [router.pathname]);
    const isCODOrdersPage = useMemo(() => router.pathname.includes('cod-cop'), [router.pathname]);

    const sortingFieldOptions = useOrdersSortingFieldOptions();

    const onOrdersFiltersChange = useOrdersFiltersChange<AdminFormOrdersFilters>(onFiltersChange);

    const handleFiltersChange = useCallback(
        (values: AdminOrdersFiltersFormState) => {
            if (isFiltersFirstRenderRef.current) {
                isFiltersFirstRenderRef.current = false;

                return;
            }

            onOrdersFiltersChange(getAdminOrdersFiltersFromFormValue(values));
        },
        [onOrdersFiltersChange],
    );

    const formRef = useRef<FormApi<AdminOrdersFiltersFormState>>();

    useEffect(() => {
        if (formRef.current) {
            const {
                dispatchers,
                driverAccountId,
                statisticsStatus,
                companyPublicId,
                fundsTransferStatus,
                instantTermPaymentType,
                fundsTransferCalculatedStatus,
                createdAtFrom,
                createdAtTo,
                search,
                searchSubject,
                orderName,
                orderDirection,
            } = initialFilters;

            const formState: AdminOrdersFiltersFormState = {
                search,
                searchSubject,
                dispatchers: dispatchers || [],
                companyPublicId,
                fundsTransferStatus,
                instantTermPaymentType,
                fundsTransferCalculatedStatus,
                createdAtFrom,
                createdAtTo,
                driverAccountId: driverAccountId || [],
                statisticsStatus: statisticsStatus || [],
            };

            if (orderName && orderDirection && sortingFieldOptions.length) {
                const orderNameOption = sortingFieldOptions[0].options.find(option => option.value === orderName);
                const orderDirectionOption = sortingFieldOptions[1].options.find(option => option.value === orderDirection);

                if (orderNameOption && orderDirectionOption) {
                    formState.sortBy = [orderNameOption, orderDirectionOption];
                }
            }

            if (!orderName && !orderDirection && !!sortingFieldOptions.length) {
                formState.sortBy = [sortingFieldOptions[0].options[0], sortingFieldOptions[1].options[0]];
            }

            formRef.current?.reset(formState);
        }
    }, [sortingFieldOptions]);

    return {
        formRef,
        isCarriersOrdersPage,
        isCODOrdersPage,
        handleFiltersChange,
        handleFormSubmit,
    };
};
