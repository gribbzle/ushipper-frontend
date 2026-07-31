import { useMemo } from 'react';

import { useMeShipper } from '@hooks';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order');

export const useAttachmentsForm = () => {
    const isMeShipper = useMeShipper();

    const othersAttachmentsTitle = useMemo((): string | undefined => (isMeShipper ? undefined : t('attachments.other-title')), [isMeShipper]);
    const isAttachmentsGroupVisible = useMemo((): boolean => !isMeShipper, [isMeShipper]);

    return { othersAttachmentsTitle, isAttachmentsGroupVisible };
};
