import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { MassPayUserTypesEnum } from '@/enums';
import { RequestError } from '@/shared';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, initiateAccountPaymentMethodsPopupPropsSelector } from '@store/admin';
import { MassPayAttribute, useCreateAccountPaymentMethodsMutation } from '@store/api/accounts-api';
import { transactionsApi } from '@store/api/transactions-api';
import { translateByNamespace } from '@utils/i18n';

import { InitiateAccountPaymentMethodsFormProps, InitiateAccountPaymentMethodsFormState } from './initiate-account-payment-methods-form.types';

const t = translateByNamespace('admin:accounting:notifications');

export const useInitiateAccountPaymentMethodsForm = ({ onAfterSubmit }: Pick<InitiateAccountPaymentMethodsFormProps, 'onAfterSubmit'>) => {
    const [createAccountPaymentMethods, { isLoading }] = useCreateAccountPaymentMethodsMutation();

    const { data, accountPublicId, balanceId } = useAppSelector(initiateAccountPaymentMethodsPopupPropsSelector);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isTransactionsPage = useMemo(() => router.asPath.includes('/admin/accounting/transactions'), [router.asPath]);

    useEffect(() => {
        dispatch(accountingActions.setIsCreateAccountPaymentMethodsLoading(isLoading));
    }, [dispatch, isLoading]);

    const onSubmit = useCallback(
        async (values: InitiateAccountPaymentMethodsFormState) => {
            if (accountPublicId && data && balanceId) {
                try {
                    const { paymentMethodType } = values;

                    const attributes: MassPayAttribute[] = data.masspay.attributes.map(attr => ({
                        token: attr.token,
                        value: String(values[attr.type] || ''),
                    }));

                    const preparedData = {
                        balanceId,
                        paymentMethodType,
                        masspay: { paymentMethodId: data.masspay.paymentMethodId, attributes },
                    };

                    await createAccountPaymentMethods({ accountPublicId, data: preparedData }).unwrap();

                    onAfterSubmit();
                    toast.success<string>(t('upload-account-payment-methods-success'));
                    if (isTransactionsPage) {
                        dispatch(transactionsApi.util.invalidateTags([{ type: 'Transactions', id: 'LIST' }]));
                    }
                } catch (error) {
                    parseAndShowAxiosError(error as RequestError, t('upload-account-payment-methods-error'));
                }
            }
        },
        [dispatch, onAfterSubmit, createAccountPaymentMethods, accountPublicId, data, balanceId, isTransactionsPage],
    );

    const initialValues = useMemo<InitiateAccountPaymentMethodsFormState>(() => {
        const { paymentMethodType, masspay } = data || {};

        const masspayAttributes = masspay?.attributes.reduce<Partial<Record<MassPayUserTypesEnum, string>>>((acc, attr) => {
            acc[attr.type] = attr.value || '';

            return acc;
        }, {});

        return {
            paymentMethodType: paymentMethodType ?? 'masspay',
            ...masspayAttributes,
        };
    }, [data]);

    const fieldNames = useMemo(() => {
        const keys = Object.keys(initialValues);

        return keys.includes('IDSelfieCollection') ? [...keys.filter(key => key !== 'IDSelfieCollection'), 'IDSelfieCollection'] : keys;
    }, [initialValues]);

    const attributes = useMemo(() => data?.masspay.attributes || [], [data]);

    return {
        initialValues,
        fieldNames,
        attributes,
        onSubmit,
    };
};
