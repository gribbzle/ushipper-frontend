import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { OrderTag } from '@/components/client';
import { BalanceType } from '@/enums';
import { classname, translateByNamespace } from '@utils';

import './financial-account-header.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');
const cn = classname('financial-account-header');

export const FinancialAccountHeader = ({ name, type }: { name: string; type: BalanceType }) => (
    <div className={cn()}>
        {name} <OrderTag view='enclosed'>{t(`${toKebabCase(type)}-label`)}</OrderTag>
    </div>
);
