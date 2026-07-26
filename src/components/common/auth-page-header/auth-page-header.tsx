import React from 'react';
import Head from 'next/head';

import { HelpPageLink } from '@/components/common';
import { classname } from '@utils';

import './auth-page-header.scss';

type PasswordRecoveryHeaderProps = {
    head: string;
    title: string;
};

const cn = classname('auth-page-header');

export const AuthPageHeader = ({ head, title }: PasswordRecoveryHeaderProps) => (
    <div className={cn()}>
        <Head>
            <title>{head}</title>
        </Head>
        <h1>{title}</h1>
        <HelpPageLink />
    </div>
);
