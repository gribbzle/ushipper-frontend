import React, { useCallback, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { useTrackingDisplayedPathsOnMap } from '@/components/client/tracking/drivers-tracking-map/hooks';
import { TrackingMap } from '@/components/client/tracking/common/tracking-map/tracking-map';
import { DriversSelect } from '@/components/common/drivers-select/drivers-select';
import { Paper } from '@/components/common/paper/paper';
import {FormControl} from '@/fields/form-control';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetTrackingQuery, useLazyGetDriversQuery } from '@store/api/users-api';
import { fetchedSelectedDriverIdSelector, selectedDriverOrderIdSelector, trackingActions } from '@store/client';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { DashboardEmptyBlock } from '../empty-block';

import './dashboard-current-loads.scss';

type OrdersFiltersFormState = {
    drivers: string[];
};

const cn = classname('dashboard-current-loads');
const t = translateByNamespace('client:dashboard-page:current-loads-block');

export const DashboardCurrentLoads = () => {
    const dispatch = useAppDispatch();
    const [getDrivers] = useLazyGetDriversQuery();
    const selectedDriverId = useAppSelector(fetchedSelectedDriverIdSelector);
    const selectedOrderId = useAppSelector(selectedDriverOrderIdSelector);
    const [driverNameFilter, setDriverNameFilter] = useState<string | undefined>();

    const { data: tracking } = useGetTrackingQuery({ query: driverNameFilter }, {});

    const displayedPathsOnMap = useTrackingDisplayedPathsOnMap(tracking, selectedDriverId, selectedOrderId);

    const handleFiltersChange = useCallback(
        async (values: OrdersFiltersFormState) => {
            const driverId = values?.drivers?.[0];

            if (!driverId) {
                setDriverNameFilter(undefined);
                dispatch(trackingActions.setSelectedDriverId(null));
                dispatch(trackingActions.setSelectedDriverOrderId(null));

                return;
            }

            const { data } = await getDrivers({ publicIds: [driverId] }).unwrap();

            setDriverNameFilter(data?.[0]?.name);

            dispatch(trackingActions.setSelectedDriverId(driverId));
            dispatch(trackingActions.setSelectedDriverOrderId(null));
        },
        [dispatch, getDrivers],
    );
    const body = useMemo(() => {
        if (tracking) {
            return (
                <div className={cn()}>
                    <div className={cn('loads')}>
                        {/*<UsersTrackingProvider value={tracking}>*/}
                        {/*    <DriverList />*/}
                        {/*</UsersTrackingProvider>*/}
                    </div>
                    <div className={cn('map')}>
                        <TrackingMap />
                    </div>
                </div>
            );
        }

        return <DashboardEmptyBlock />;
    }, [displayedPathsOnMap, tracking]);

    return (
        <Paper
            title={t('title')}
            actions={
                <Form<OrdersFiltersFormState>
                    onSubmit={handleFiltersChange}
                    subscription={{ values: true }}
                    initialValues={{ drivers: [] }}
                    render={({ handleSubmit }) => (
                        <form className={cn('form')} onSubmit={handleSubmit}>
                            <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                            <FormControl>
                                <Field
                                    name='drivers'
                                    component={DriversSelect}
                                    placeholder={t('drivers-filter-placeholder')}
                                    isMulti={false}
                                    isClearable={true}
                                />
                            </FormControl>
                        </form>
                    )}
                />
            }
            body={body}
            className={cn('paper')}
        />
    );
};
