import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { BackLink } from '@/components/common/back-link/back-link';
import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { PageTitle } from '@/components/common/page-title/page-title';
import { CheckIcon } from '@icons';
import { useGetOrderQuery } from '@store/api/orders-api';
import { OrderFormEnum } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order:edit-page');

const Header = () => {
    const { query } = useRouter();

    const orderId = query['order-id'] as string;
    const { isError } = useGetOrderQuery(orderId);
    const handleSaveClick = useCallback(() => {
        document.getElementById(OrderFormEnum.GENERAL)?.dispatchEvent(new Event('click', { cancelable: true, bubbles: true }));
    }, []);

    const saveBtn = useMemo(
        () => (
            <Button view='primary' size='medium' onClick={handleSaveClick}>
                <CheckIcon /> {t('save-btn-label')}
            </Button>
        ),
        [handleSaveClick],
    );

    return (
        <PageHeader>
            {!isError && (
                <>
                    <BackLink />
                    <PageTitle title={t('back-btn-label')} />
                    {saveBtn}
                </>
            )}
        </PageHeader>
    );
};

export default Header;
