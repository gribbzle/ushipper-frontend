import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

import { classname } from '@utils/classname';

import './date-info.scss';

type DateInfoProps = {
    date?: string | null;
    timezone?: string | null;
    showWithTimeZone?: boolean;
    inline?: boolean;
};

const cn = classname('date-info');

export const DateInfo = ({ date, showWithTimeZone = false, timezone, inline = false }: DateInfoProps) => {
    const formattedDate = useMemo(() => {
        if (!date) return <>—</>;

        return showWithTimeZone ? formatInTimeZone(new Date(date), timezone || 'America/Los_Angeles', 'dd.MM.yyyy') : format(new Date(date), 'dd.MM.yyyy');
    }, [showWithTimeZone, date, timezone]);

    const formattedTime = useMemo(() => {
        if (!date) return null;

        return showWithTimeZone
            ? formatInTimeZone(new Date(date), timezone || 'America/Los_Angeles', 'h:mm a (zzz)', { locale: enUS })
            : format(new Date(date), 'HH:mm');
    }, [showWithTimeZone, date, timezone]);

    return (
        <div className={cn('', { inline })}>
            {formattedDate}
            <span className={cn('time')}>{formattedTime}</span>
        </div>
    );
};
