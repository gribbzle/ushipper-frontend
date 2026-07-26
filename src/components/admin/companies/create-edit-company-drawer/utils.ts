import { translateByNamespace } from '@utils';

import { CreateEditFormState, FrontendErrors } from './create-edit-company-drawer..types';

const t = translateByNamespace('admin:companies-page:create-edit-company-drawer');
const commonT = translateByNamespace('common:validators');

// WIP: add some more translations for errors
export const translateErrors = (errors: FrontendErrors): FrontendErrors => {
    const errorsObj = { ...errors };

    if (errorsObj.name && errorsObj.name.includes('The name has already been taken.')) {
        errorsObj.name = t('validationErrors:name-already-exists');
    }
    if (errorsObj.email && errorsObj.email.includes('The owner email has already been taken.')) {
        errorsObj.email = t('validationErrors:email-already-exists');
    }

    return errorsObj;
};

export const validateCreateEditForm = (formValues: CreateEditFormState): FrontendErrors | undefined => {
    if (formValues.ownerPassword !== formValues.ownerPasswordConfirmation) {
        return { ownerPasswordConfirmation: commonT('passwords-do-not-match') };
    }

    return undefined;
};
