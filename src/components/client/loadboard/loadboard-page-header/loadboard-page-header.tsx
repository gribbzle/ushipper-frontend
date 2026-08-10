import React, { useCallback, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/common/button/button';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { useLoadboardTabSelection } from '@/hooks/loadboard/useLoadboardTabSelection';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { useAppSelector } from '@store';
import { INITIAL_FILTERS, loadboardActions } from '@store/client/loadboard/slice';
import { classname } from '@utils/classname';
import { areFiltersEqual } from '@utils/filters';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './loadboard-page-header.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import SaveIcon from '@/assets/icons/save.svg';

const t = translateByNamespace('client:loadboard');
const cn = classname('loadboard-page-header');

export const LoadboardPageHeader = () => {
    const router = useRouter();
    const pathname = router.pathname;
    const params = router.query;
    const { filters } = useAppSelector(state => state.client.loadboard.list);
    const dispatch = useDispatch();
    const { activeTab, isSavedTab, isAllTab } = useLoadboardTabSelection();
    const isMeCarrier = useMeCarrier();

    const areFiltersChanged = useMemo<boolean>(() => !areFiltersEqual(INITIAL_FILTERS, filters), [filters]);

    const handleURLChange = useCallback(
        async (key: string, value: string) => {
            const updatedParams = { ...params, [key]: value };

            await router.replace(
                {
                    pathname,
                    query: updatedParams,
                },
                {
                    pathname: router.asPath.split('?')[0],
                    query: updatedParams,
                },
                { shallow: true },
            );
            dispatch(loadboardActions.setListFilters({ [key]: value }));
        },
        [params, pathname, router, dispatch],
    );

    const handleFiltersChange = useCallback(
        (checked: boolean) => {
            handleURLChange('filters', Number(checked).toString());
        },
        [handleURLChange],
    );

    const handleMapChange = useCallback(
        (checked: boolean) => {
            handleURLChange('map', Number(checked).toString());
        },
        [handleURLChange],
    );

    const openOpenSaveSearchDrawer = useCallback(() => {
        dispatch(loadboardActions.setSaveSearchDrawer({ opened: true }));
    }, [dispatch]);

    const showForm = useMemo(() => !activeTab || isAllTab || isSavedTab, [activeTab, isAllTab, isSavedTab]);

    return (
        <div className={cn('')}>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <span>{t('head.title')}</span>
            {params && (
                <div className={cn('form', { show: showForm })}>
                    <NativeSwitch label={t('head.filters')} onChange={handleFiltersChange} checked={params?.filters !== '0'} />
                    <NativeSwitch label={t('head.map')} onChange={handleMapChange} checked={params?.map === '1'} />
                    {areFiltersChanged && isMeCarrier && (
                        <Button className={cn('save-filters-btn')} type='button' view='plain-primary' size='medium' onClick={openOpenSaveSearchDrawer}>
                            <SaveIcon />
                            {t('head.save-filters')}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
