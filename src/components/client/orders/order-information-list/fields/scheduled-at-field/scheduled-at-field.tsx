import React, { useMemo } from 'react';

import { DateTypes } from '@enums';
import { useMeShipper } from '@hooks';
import { ScheduleIcon } from '@icons';
import { formatLongDateOrGetDash, translateByNamespace } from '@utils';

import { ItemField } from '../item-field';

const t = translateByNamespace('client:order');
const dateTypesT = translateByNamespace('common:date-types');

type ScheduledAtFieldProps = {
    scheduledAt: string;
    dateType?: DateTypes | null;
};

export const ScheduledAtField = ({ scheduledAt, dateType }: ScheduledAtFieldProps) => {
    const isShipper = useMeShipper();

    const date = useMemo(
        () => `${t('sheduled-for', { date: formatLongDateOrGetDash(scheduledAt) })} ${isShipper && dateType ? dateTypesT(dateType) : ''}`,
        [dateType, isShipper, scheduledAt],
    );

    return <ItemField icon={<ScheduleIcon />} value={date} />;
};
