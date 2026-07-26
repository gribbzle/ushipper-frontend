import React from 'react';

import { OfferStatusesEnum } from '@/enums';

export type JobOfferStatusTagProps = {
    children: React.ReactNode;
    view?: OfferStatusesEnum;
};
