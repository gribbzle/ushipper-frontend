import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CompanyType } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { useAppSelector } from '@store';
import { accountsUsersSelector } from '@store/client/accounts';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:sidebar');

export const AccountSelect = (props: FieldRenderProps<string>) => {
    const fetchedAccounts = useAppSelector(accountsUsersSelector);

    const options = useMemo(
        () =>
            fetchedAccounts?.map(account => ({
                value: account.publicId,
                label: [CompanyType.DISPATCHER, CompanyType.DRIVER].includes(account.company?.type as CompanyType)
                    ? (account.company?.type as CompanyType) === CompanyType.DRIVER
                        ? t('my-driver-profile-label')
                        : t('my-dispatcher-profile-label')
                    : account.company?.name,
            })),
        [fetchedAccounts],
    );

    return <SelectField {...props} options={options} isClearable={false} />;
};
