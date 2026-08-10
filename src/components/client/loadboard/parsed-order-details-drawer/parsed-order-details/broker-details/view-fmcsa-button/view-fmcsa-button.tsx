import React from 'react';

import { Button } from '@/components/common/button/button';
import { ExternalLinkIcon } from '@icons';
import { translateByNamespace } from '@utils/i18n';

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
