import { useCallback } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, savedDocumentsSelector } from '@store/admin';
import { accountsApi, DocumentType, useDeleteAccountingProfileDocumentMutation } from '@store/api/accounts-api';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

import { useGetAccountingProfile } from '../../../../hooks/use-get-accounting-profile';
import { useGetAccountingProfileDocuments } from '../../../../hooks/use-get-accounting-profile-documents';

import { fromDocumentTypeToOpenPopupProps } from './from-document-type-to-open-popup-props';

const t = translateByNamespace('admin:accounting:notifications');

export const useRocketkorBaseDocument = (type: DocumentType) => {
    const documents = useGetAccountingProfileDocuments();
    const document = documents?.find(document => document.type === type);
    const savedDocuments = useAppSelector(savedDocumentsSelector);
    const savedDocument = savedDocuments.find(savedDocument => savedDocument.document.type === type);
    const dispatch = useAppDispatch();
    const [deleteAccountingProfileDocument] = useDeleteAccountingProfileDocumentMutation();
    const { account, accountingProfile } = useGetAccountingProfile();

    const handleEdit = useCallback(() => {
        const popupProps = fromDocumentTypeToOpenPopupProps.get(type);

        if (popupProps) {
            dispatch(accountingActions.setRocketkorDocumentPopupProps({ ...popupProps, editDocument: savedDocument ? savedDocument.document : document }));
        }
    }, [dispatch, document, savedDocument, type]);

    const handleDelete = useCallback(async () => {
        try {
            if (account && accountingProfile && document) {
                await deleteAccountingProfileDocument({
                    accountId: account.publicId,
                    accountingProfileId: accountingProfile.publicId,
                    documentId: document.publicId,
                }).unwrap();

                dispatch(accountsApi.util.invalidateTags([{ type: 'RocketkorDocuments', id: 'LIST' }]));
                dispatch(accountingActions.setRocketkorDocumentPopupProps({ editDocument: null }));
                toast.success<string>(t('attachment-delete-success'));
            }
        } catch (exception) {
            const err = exception as AxiosResponse<AxiosError>;
            const {
                data: { message },
                status,
            } = err;

            if (status === 404 && message.toLowerCase().startsWith('no query result')) {
                toast.error<string>(t('no-found-attachment-error'));
            } else {
                handleError(exception);
            }
        }
    }, [account, accountingProfile, deleteAccountingProfileDocument, dispatch, document]);

    return {
        document: savedDocument ? savedDocument.document : document,
        handleEdit,
        handleDelete,
    };
};
