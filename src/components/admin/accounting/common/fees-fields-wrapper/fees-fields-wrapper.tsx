import React, { ReactNode } from 'react';

import { Button } from '@/components/common';
import { FeeCategoryValueType } from '@/enums';
import { PlusCircleIcon } from '@icons';
import { classname, isFreightX, translateByNamespace } from '@utils';

import './fees-fields-wrapper.scss';

const cn = classname('fees-fields-wrapper');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

export type FeeTermTypeFields = 'delayedFees' | 'instantFees';

export const FEE_TERM_TYPES_FIELDS: FeeTermTypeFields[] = ['delayedFees', 'instantFees'];

export const getFeeTermTypesFieldsOfProject = (): FeeTermTypeFields[] => (isFreightX ? ['delayedFees'] : ['delayedFees', 'instantFees']);

export const renderAddButton = ({ fields, disabled }: { fields: any; disabled: boolean }) => (
    <Button
        plain={true}
        view='primary'
        size='small'
        disabled={disabled}
        onClick={() =>
            fields.push({
                valueType: FeeCategoryValueType.PERCENT,
            })
        }
    >
        <PlusCircleIcon /> {t('add-fee')}
    </Button>
);

type FeesFieldsWrapperProps = {
    children: ReactNode;
    title: string;
    className?: string;
    isDanger?: boolean;
};

export const FeesFieldsWrapper = ({ children, title, className, isDanger = false }: FeesFieldsWrapperProps) => (
    <div className={cn('', { danger: isDanger }, [className])}>
        <span className={cn('title')}>{title}</span>
        {children}
    </div>
);
