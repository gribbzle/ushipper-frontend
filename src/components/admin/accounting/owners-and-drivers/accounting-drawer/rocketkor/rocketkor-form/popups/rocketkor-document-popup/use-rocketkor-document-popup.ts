import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';

import { useAppSelector } from '@store';
import { isCreateAccountingProfileLoadingSelector, rocketkorDocumentsPopupsPropsSelector } from '@store/admin';

import { DocumentFormValue } from '../../document-form';

export const useRocketkorDocumentPopup = (handleClose: () => void) => {
    const formRef = useRef<FormApi<DocumentFormValue>>();
    const { editDocument } = useAppSelector(rocketkorDocumentsPopupsPropsSelector);
    const isLoading = useAppSelector(isCreateAccountingProfileLoadingSelector);
    const [hasAttachmentsDropzone, setHasAttachmentsDropzone] = useState<boolean>(false);

    const initialValues = useMemo(
        () => ({
            ...editDocument,
        }),
        [editDocument],
    );

    const handleSubmit = useCallback(() => formRef.current?.submit(), []);

    useEffect(() => {
        setHasAttachmentsDropzone(!!initialValues.attachment);
    }, [initialValues.attachment]);

    const handlePopupClose = useCallback(() => {
        setHasAttachmentsDropzone(false);
        handleClose();
    }, [handleClose]);

    return {
        formRef,
        initialValues,
        isLoading,
        handleSubmit,
        hasAttachmentsDropzone,
        setHasAttachmentsDropzone,
        handlePopupClose,
    };
};
