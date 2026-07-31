import React, { useCallback, useMemo } from 'react';
import { debounce } from 'debounce';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button, CarMakersTable, CreateUpdateCarMakerDrawer, DeleteCarMakerPopup, getMainLayout, Input } from '@components';
import { useEffectOnce } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { CarMakersFilters, carMakersFiltersSelector, fetchCarMakerAction, fetchCarMakersAction } from '@store/admin';
import { carMakersSettingsActions } from '@store/admin/car-makers-settings/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { getProjectName } from '@utils/translate/get-project-name';

import './car-makers.scss';

const cn = classname('car-makers-page');
const t = translateByNamespace('admin:car-makers-page');

const CarMakersPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const getStateFiltersFromUrlParams = (): Partial<CarMakersFilters> => {
        const { name, orderName, orderDirection, perPage } = router.query;
        const filters: Partial<CarMakersFilters> = {};

        if (name && typeof name === 'string') {
            filters.name = name;
        }
        if (orderName && typeof orderName === 'string') {
            filters.orderName = orderName;
        }
        if (orderDirection && typeof orderDirection === 'string') {
            filters.orderDirection = orderDirection;
        }
        if (perPage && typeof perPage === 'string') {
            filters.perPage = Number(perPage);
        }

        return filters;
    };

    useEffectOnce(() => {
        dispatch(carMakersSettingsActions.setFilters(getStateFiltersFromUrlParams()));
        fetchCarMakers();
    }, []);

    const fetchCarMakers = useCallback(() => {
        dispatch(fetchCarMakersAction());
    }, [dispatch]);

    const fetchCarMaker = useCallback(
        (carMakerId: number) => {
            dispatch(fetchCarMakerAction(carMakerId));
        },
        [dispatch],
    );

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <CarMakersTable onPageChange={fetchCarMakers} onOrderChange={fetchCarMakers} onRowClick={fetchCarMaker} />
            <CreateUpdateCarMakerDrawer />
            <DeleteCarMakerPopup />
        </div>
    );
};

const PageHead = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const filters = useAppSelector(carMakersFiltersSelector);

    const onAddCarMakerHandler = useCallback(() => {
        dispatch(
            carMakersSettingsActions.setCreateEditCarMakerDrawerProps({
                isVisible: true,
                mode: 'create',
                carMakerId: null,
                carMakerName: null,
            }),
        );
    }, [dispatch]);

    const fetchCarMakersDebounced = useMemo(() => {
        const fetchCarMakers = (name: string) => {
            dispatch(carMakersSettingsActions.setFilters({ page: 1 }));
            dispatch(fetchCarMakersAction());
            router.replace({ pathname: router.pathname, query: getObjectWithoutEmptyFields({ ...router.query, name }) });
        };

        return debounce(fetchCarMakers, 300);
    }, [dispatch, router]);

    const onNameChangeHandler = useCallback(
        (name: string) => {
            dispatch(carMakersSettingsActions.setFilters({ name: name || null }));
            fetchCarMakersDebounced(name);
        },
        [dispatch, fetchCarMakersDebounced],
    );

    return (
        <div className={cn('head')}>
            {t('header')}
            <Button view='primary' size='medium' onClick={onAddCarMakerHandler}>
                <PlusCircleIcon /> {t('add-maker-button')}
            </Button>
            <Input
                value={filters.name ?? ''}
                name='name'
                onChange={event => onNameChangeHandler(event.target.value)}
                placeholder={t('name-filter-placeholder')}
            />
        </div>
    );
};

CarMakersPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanelSettings', functionality: 'admin_panel.settings.car_makers.view_any' }],
});

export default CarMakersPage;
