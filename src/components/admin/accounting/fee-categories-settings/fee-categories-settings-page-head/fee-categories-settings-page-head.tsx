import React from 'react';
import Head from 'next/head';

import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { PlusCircleIcon } from '@icons';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

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
