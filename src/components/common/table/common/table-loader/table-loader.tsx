import React from 'react';

import { Loader } from '@/components/common/loader';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { classname } from '@utils/classname';

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
