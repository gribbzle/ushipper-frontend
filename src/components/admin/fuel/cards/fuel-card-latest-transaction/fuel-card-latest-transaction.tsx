import React from 'react';

import { DateInfo } from '@/components/common/table/common/date-info/date-info';
import { FuelCardRawData } from '@store/admin';

export const FuelCardLatestTransaction = ({ rawData }: { rawData: FuelCardRawData }) => {
    const lastTransaction = rawData.header?.lastTransaction;
    const formattedDate = lastTransaction ? new Date(lastTransaction * 1000).toISOString() : null;

    return <DateInfo date={formattedDate} />;
};
