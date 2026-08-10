import React from 'react';

import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';

export type JobOfferStatusTagProps = {
    children: React.ReactNode;
    view?: OfferStatusesEnum;
};
