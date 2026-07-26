import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/common';
import { classname, translateByNamespace } from '@utils';

import './dashboard-empty-block.scss';

const cn = classname('dashboard-empty-block');
const t = translateByNamespace('client:dashboard-page:empty-block');

type Props = {
    isCompanyPage?: boolean;
};

export const DashboardEmptyBlock = ({ isCompanyPage }: Props) => {
    return (
        <div className={cn()}>
            <h4>{t('title')}</h4>
            {!isCompanyPage && (
                <>
                    <p>{t('description')}</p>
                    <Link href='/client/loadboard' as='/loadboard'>
                        <Button type='button' view='plain-primary'>
                            {t('action')}
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
};
