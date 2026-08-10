import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncUserSelect } from '@/components/common/user-select/async-user-select';
import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { FormControl, InputLabel } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';
import { required } from '@validators';

import { AssignDispatcherFormState } from './assign-dispatcher-to-driver-popup.types';
import { useAssignDispatcherToDriverPopup } from './use-assign-dispatcher-to-driver-popup';

import './assign-dispatcher-to-driver-popup.scss';

const cn = classname('assign-dispatcher-to-driver-popup');
const t = translateByNamespace('admin:accounting:assign-dispatcher-to-driver-popup');
const tDefaultName = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer');

export const AssignDispatcherToDriverPopup = () => {
    const { formRef, isPopupOpened, user, reassign, initialValues, onSubmit, handleSubmitClick, handleClosePopup } = useAssignDispatcherToDriverPopup();
    const { company, role } = user || {};

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick}>
                    {t(`${reassign ? 'reassign' : 'assign'}`)}
                </Button>
                <Button view='default' size='small' onClick={handleClosePopup}>
                    {t('cancel')}
                </Button>
            </>
        ),
        [reassign, handleClosePopup, handleSubmitClick],
    );

    const form = useMemo(
        () => (
            <Form<AssignDispatcherFormState>
                subscription={{ values: true }}
                initialValues={initialValues}
                onSubmit={onSubmit}
                render={({ form }) => {
                    formRef.current = form;

                    return (
                        <form>
                            <FormControl>
                                <InputLabel required={true}>{t('dispatcher-label')}</InputLabel>
                                <Field
                                    disabled={!role?.id}
                                    name='superiorUserPublicId'
                                    parse={parseField}
                                    component={AsyncUserSelect}
                                    superiorsForRoleId={role?.id}
                                    companyId={company?.publicId}
                                    isClearable={false}
                                    placeholder=''
                                    validate={required}
                                    hideUserOwnerOption={true}
                                />
                            </FormControl>
                        </form>
                    );
                }}
            />
        ),
        [company?.publicId, formRef, initialValues, onSubmit, role?.id],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onTop={true}
            className={cn()}
            onClose={handleClosePopup}
            title={t(`${reassign ? 'reassign' : 'assign'}-title`, { name: user?.name ?? tDefaultName('default-title') })}
            description={form}
            actions={actions}
        />
    );
};
