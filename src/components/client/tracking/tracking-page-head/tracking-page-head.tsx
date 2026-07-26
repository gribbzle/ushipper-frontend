import React from 'react';
import Head from 'next/head';

import { getProjectName, translateByNamespace } from '@utils';

import { CarrierTrackingPageHead } from './carrier-tracking-page-head';

const t = translateByNamespace('client:tracking-page');

export const TrackingPageHead = () => {
    return (
        <>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <CarrierTrackingPageHead />
        </>
    );
};
