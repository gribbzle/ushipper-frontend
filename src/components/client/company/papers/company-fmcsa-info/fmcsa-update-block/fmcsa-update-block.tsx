import React, { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { Link } from '@/components/common/link/link';
import { useUpdateCompanyFMCSARecordMutation } from '@store/api/company-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './fmcsa-update-block.scss';

type Props = {
    companyId: string;
    isCanBeRefreshed?: boolean;
    lastCheckedDate?: string;
};

const t = translateByNamespace('client:company-page:fmcsa-info');
const translateNotification = translateByNamespace('client:company-page:notification');
const translateEmptyTitle = translateByNamespace('client:company-page');
const cn = classname('update-block');

export const FMCSAUpdateBlock = ({ companyId, isCanBeRefreshed = false, lastCheckedDate }: Props) => {
    const [updateCompanyFMCSAInfo] = useUpdateCompanyFMCSARecordMutation();

    const [isUpdateLink, setIsUpdateLink] = useState(true);
    const isShowUpdateLink = isUpdateLink && isCanBeRefreshed;

    const lastCheckedAt = useMemo(
        () => (lastCheckedDate ? format(new Date(lastCheckedDate), 'MMM d, yyyy') : translateEmptyTitle('empty-value')),
        [lastCheckedDate],
    );

    const handleUpdateFMCSAInfo = useCallback(() => {
        updateCompanyFMCSAInfo(companyId)
            .unwrap()
            .then(() => {
                toast.success(translateNotification<string>('update-fmcsa-success'));
                setIsUpdateLink(false);
            })
            .catch(() => {
                toast.error(translateNotification<string>('update-fmcsa-error'));
            });
    }, [companyId, updateCompanyFMCSAInfo]);

    return (
        <div className={cn('')}>
            {t('last-checked', { date: lastCheckedAt })}
            {isShowUpdateLink && (
                <Link href='#' onClick={handleUpdateFMCSAInfo}>
                    {t('update-link-label')}
                </Link>
            )}
        </div>
    );
};
