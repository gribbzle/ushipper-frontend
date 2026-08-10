import React, { useCallback, useMemo } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/common/button/button';
import { CarModelsFilters as CarModelsFiltersComponent } from '@/components/admin/settings/car-models/car-models-filters/car-models-filters';
import { CarModelsTable } from '@/components/admin/settings/car-models/car-models-table/car-models-table';
import { CreateEditCarModelDrawer } from '@/components/admin/settings/car-models/create-edit-car-model-drawer/create-edit-car-model-drawer';
import { DeleteCarModelPopup } from '@/components/admin/settings/car-models/delete-car-model-popup/delete-car-model-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useEffectOnce } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import {
    CarModelsFilters,
    carModelStatusesRequestStatusSelector,
    fetchCarModelAction,
    fetchCarModelsAction,
    fetchCarModelStatusesAction,
    filterSearchCarMakersAction,
    filterSearchCarMakersCalledSelector,
} from '@store/admin';
import { carModelsSettingsActions } from '@store/admin/car-models-settings/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { getProjectName } from '@utils/translate/get-project-name';

import './car-models.scss';

const t = translateByNamespace('admin:car-models-page');
const cn = classname('car-models-page');

const CarModelsPage = () => {
    const dispatch = useAppDispatch();
    const params = useSearchParams();

    const carModelStatusesRequestStatus = useAppSelector(carModelStatusesRequestStatusSelector);
    const filterSearchCarMakersCalled = useAppSelector(filterSearchCarMakersCalledSelector);

    const areModelStatusesLoaded = carModelStatusesRequestStatus === RequestStatus.SUCCESS || carModelStatusesRequestStatus === RequestStatus.ERROR;
    const areResourcesLoaded = areModelStatusesLoaded && filterSearchCarMakersCalled;

    const getStateFiltersFromUrlParams = useMemo<Partial<CarModelsFilters>>(() => {
        const filters: Partial<CarModelsFilters> = {};

        filters.modelName = params.get('modelName');
        filters.status = params.get('status');
        filters.makerId = params.get('makerId');
        filters.orderName = params.get('orderName');
        filters.orderDirection = params.get('orderDirection');

        return filters;
    }, [params]);

    useEffectOnce(() => {
        dispatch(carModelsSettingsActions.setFilters(getStateFiltersFromUrlParams));
        dispatch(fetchCarModelsAction());
        dispatch(fetchCarModelStatusesAction());
        dispatch(filterSearchCarMakersAction(params.get('makerName')));
    }, []);

    const fetchCarModels = useCallback(() => {
        dispatch(fetchCarModelsAction());
    }, [dispatch]);

    const fetchCarModel = useCallback(
        (id: number) => {
            dispatch(fetchCarModelAction(id));
        },
        [dispatch],
    );

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            {areResourcesLoaded && (
                <>
                    <CarModelsFiltersComponent onFiltersChange={fetchCarModels} />
                    <CarModelsTable onPageChange={fetchCarModels} onSortChange={fetchCarModels} onRowClick={fetchCarModel} />
                </>
            )}
            <CreateEditCarModelDrawer />
            <DeleteCarModelPopup />
        </div>
    );
};

const PageHead = () => {
    const dispatch = useAppDispatch();

    const onAddCarModelHandler = useCallback(() => {
        dispatch(
            carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                isVisible: true,
                mode: 'create',
                carModelId: null,
                carModelName: null,
            }),
        );
    }, [dispatch]);

    return (
        <div className={cn('head')}>
            {t('header')}
            <Button view='primary' size='medium' onClick={onAddCarModelHandler}>
                <PlusCircleIcon /> {t('add-model-button-text')}
            </Button>
        </div>
    );
};

CarModelsPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanelSettings', functionality: 'admin_panel.settings.cars_models.view_any' }],
});

export default CarModelsPage;
