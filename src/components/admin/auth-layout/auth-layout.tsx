import React, { ReactNode } from 'react';

import logos from '@logo';
import { classname } from '@utils';

import './auth-layout.scss';

const cn = classname('auth-layout');

type AuthLayoutProps = {
    children: ReactNode;
};

const { LogoWhiteDefaultAdmin } = logos;

export const AdminAuthLayout = ({ children }: AuthLayoutProps) => (
    <div className={cn()}>
        <div className={cn('geometry-1')} />
        <div className={cn('geometry-2')} />
        <LogoWhiteDefaultAdmin className={cn('logo')} />
        <div className={cn('form-container')}>{children}</div>
    </div>
);

export const getAdminAuthLayout = (page: React.ReactNode) => <AdminAuthLayout>{page}</AdminAuthLayout>;
