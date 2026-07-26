import React from 'react';

import { Paper } from '@/components/common';
import { classname } from '@utils';

import { AccountingEntityFiltersForm } from './accounting-entity-filters-form';

import './accounting-entity-filters.scss';

const cn = classname('accounting-entity-filters');

export const AccountingEntityFilters = () => <Paper bodyClassName={cn()} body={<AccountingEntityFiltersForm />} />;
