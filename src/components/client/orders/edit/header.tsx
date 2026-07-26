import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { BackLink, Button, PageHeader, PageTitle } from '@components';
import { CheckIcon } from '@icons';
import { useGetOrderQuery } from '@store/api/orders-api';
import { OrderFormEnum } from '@store/client';
import { translateByNamespace } from '@utils';

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
