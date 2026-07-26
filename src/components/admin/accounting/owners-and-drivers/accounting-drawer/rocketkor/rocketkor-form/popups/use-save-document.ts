import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { AttachmentType } from '@/enums';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, rocketkorDocumentsPopupsPropsSelector, RocketkorDocumentsPopupsState } from '@store/admin';
import { accountsApi, DocumentType, useSendAccountingProfileDocumentMutation, useUpdateAccountingProfileDocumentMutation } from '@store/api/accounts-api';
import { getObjectWithoutEmptyFields, handleError, translateByNamespace } from '@utils';

import { useGetAccountingProfile } from '../../../hooks';
import { DocumentFormValue } from '../document-form';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

const fromDocumentTypeToPopupProps = new Map<DocumentType, Partial<RocketkorDocumentsPopupsState>>([
    ['tax_document', { isTaxDocumentPopupOpened: false }],
    ['ownership_document', { isOwnershipDocumentPopupOpened: false }],
    ['passport', { isPassportPopupOpened: false }],
]);

export const useSaveDocument = (type: DocumentType) => {
    const { account, accountingProfile } = useGetAccountingProfile();
    const [sendAccountingProfileDocument] = useSendAccountingProfileDocumentMutation();
    const [updateAccountingProfileDocument] = useUpdateAccountingProfileDocumentMutation();
    const dispatch = useAppDispatch();
    const { editDocument } = useAppSelector(rocketkorDocumentsPopupsPropsSelector);

    const handleSave = useCallback(
        async (values: DocumentFormValue) => {
            try {
                dispatch(accountingActions.setIsCreateAccountingProfileLoading(true));

                if (account?.publicId && accountingProfile?.publicId) {
                    const fields = {
                        accountId: account.publicId,
                        accountingProfileId: accountingProfile.publicId,
                        type,
                        ...values,
                    };

                    if (editDocument) {
                        await updateAccountingProfileDocument({
                            ...getObjectWithoutEmptyFields(fields),
                            documentId: editDocument.publicId,
                        }).unwrap();
                    } else {
                        await sendAccountingProfileDocument(fields).unwrap();
                    }

                    dispatch(accountsApi.util.invalidateTags([{ type: 'RocketkorDocuments', id: 'LIST' }]));
                    toast.success(t<string>(editDocument ? 'attachment-update-success' : 'attachment-create-success'));
                } else {
                    const { files, ...fields } = values;

                    dispatch(
                        accountingActions.addSavedDocuments({
                            document: {
                                country: '',
                                expiryDate: '',
                                issuingDate: '',
                                state: '',
                                number: '',
                                ...fields,
                                type,
                                attachment: {
                                    createdAt: '',
                                    creator: null,
                                    extension: '',
                                    name: files[0].name,
                                    previewImages: [],
                                    publicId: '',
                                    size: files[0].size,
                                    type: AttachmentType.CD_CONTRACT,
                                    url: '',
                                    updatedAt: '',
                                },
                                createdAt: '',
                                publicId: '',
                                updatedAt: '',
                            },
                            files: files,
                        }),
                    );
                }

                const popupProps = fromDocumentTypeToPopupProps.get(type);

                if (popupProps) {
                    dispatch(accountingActions.setRocketkorDocumentPopupProps({ ...popupProps, editDocument: null }));
                }
            } catch (exception) {
                handleError(exception);
            }

            dispatch(accountingActions.setIsCreateAccountingProfileLoading(false));
        },
        [account?.publicId, accountingProfile?.publicId, dispatch, editDocument, sendAccountingProfileDocument, type, updateAccountingProfileDocument],
    );

    return handleSave;
};
