import React from 'react';

import { classname } from '@utils/classname';

import { CompanyLogoProps } from './company-logo.types';

import './company-logo.scss';

const cn = classname('company-logo');

export const CompanyLogo = ({ logoUrl, className }: CompanyLogoProps) => {
    return (
        <div className={cn('', [className])}>
            <img src={logoUrl} alt='company-logo' />
        </div>
    );
};
