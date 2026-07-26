import React from 'react';

import { Button } from '@/components/common';
import { ExternalLinkIcon } from '@icons';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:loadboard:load-details');

export const ViewFMCSAButton = ({ mcNumber }: { mcNumber: string }) => (
    <Button
        size='mini'
        onClick={() =>
            window.open(`https://li-public.fmcsa.dot.gov/LIVIEW/pkg_carrquery.prc_carrlist?s_prefix=MC&n_docketno=${encodeURIComponent(mcNumber)}`, '_blank')
        }
    >
        <ExternalLinkIcon /> {t('view-on-fmcsa-btn')}
    </Button>
);
