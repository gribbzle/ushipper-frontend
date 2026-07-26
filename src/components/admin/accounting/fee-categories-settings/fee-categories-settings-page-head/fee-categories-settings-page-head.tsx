import React from 'react';
import Head from 'next/head';

import { Button, PageHeader } from '@components';
import { PlusCircleIcon } from '@icons';
import { getProjectName, translateByNamespace } from '@utils';

import { useFeeCategoriesTable } from '../fee-categories-table/use-fee-categories-table';

const t = translateByNamespace('admin:accounting:fee-categories-settings');

export const FeeCategoriesSettingsPageHead = () => {
    const { onRowClickHandler } = useFeeCategoriesTable();

    return (
        <>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>
                {t('header')}
                <Button view='primary' size='medium' onClick={() => onRowClickHandler(null)}>
                    <PlusCircleIcon /> {t('add-fee-category-button')}
                </Button>
            </PageHeader>
        </>
    );
};
