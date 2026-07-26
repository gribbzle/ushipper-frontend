import React from 'react';

import { Loader } from '@/components/common/loader';
import { Paper } from '@components';
import { classname } from '@utils';

import './table-loader.scss';

const cn = classname('table-loader');

export const TableLoader = () => (
    <Paper
        body={
            <div className={cn('')}>
                <Loader />
            </div>
        }
    />
);
