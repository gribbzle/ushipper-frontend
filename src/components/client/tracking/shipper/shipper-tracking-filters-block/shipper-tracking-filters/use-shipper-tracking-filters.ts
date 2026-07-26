import { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';

import { useHandleFiltersChange, useQueryFilters } from '@hooks';
import { useAppDispatch } from '@store';
import { ShipperTrackingFiltersFormState, trackingActions } from '@store/client';
import { convertToStringArray } from '@utils';

export const useShipperTrackingFiltersForm = () => {
    const dispatch = useAppDispatch();

    const formRef = useRef<FormApi<ShipperTrackingFiltersFormState>>();

    const {
        filters: { driverFlagged, dispatchers, status },
    } = useQueryFilters<ShipperTrackingFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<ShipperTrackingFiltersFormState>({ resetPageOnChange: false });

    const onFilterChange = useCallback(
        (values: ShipperTrackingFiltersFormState) => {
            const { dispatchers, ...rest } = values;
            const preparedValues: ShipperTrackingFiltersFormState = {
                dispatchers: convertToStringArray(dispatchers),
                ...rest,
            };

            handleFiltersChange(preparedValues, true);
            dispatch(trackingActions.resetSelectedTracking());
        },
        [handleFiltersChange, dispatch],
    );

    const initialValues = useMemo<ShipperTrackingFiltersFormState>(
        () => ({
            driverFlagged: driverFlagged || 'all',
            dispatchers: convertToStringArray(dispatchers),
            status: status || 'all',
        }),
        [driverFlagged, dispatchers, status],
    );

    const handleClose = useCallback(() => dispatch(trackingActions.setOpenShipperTrackingFilters(false)), [dispatch]);

    return { onFilterChange, handleClose, initialValues, formRef };
};
