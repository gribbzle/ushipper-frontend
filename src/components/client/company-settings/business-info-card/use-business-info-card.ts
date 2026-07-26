import { useCallback, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import parseValidationFields from '@/utils/parse-validation-fields';
import { useGetCompanyData } from '@hooks';
import { CompanyPathData, usePathCompanyJSONMutation } from '@store/api/company-api';
import { transformFormValuesToSpecializations, translateByNamespace } from '@utils';

import { BusinessInfoCardFormType } from './business-info-card.types';

const t = translateByNamespace('client:company-settings');

export const useBusinessInfoCard = () => {
    const { data } = useGetCompanyData();

    const [disabledSubmit, setDisabled] = useState(true);
    const formRef = useRef<FormApi<BusinessInfoCardFormType>>();

    const [updateCompany] = usePathCompanyJSONMutation();
    const handleSubmit = useCallback(
        async (values: BusinessInfoCardFormType) => {
            const newValues: CompanyPathData = {
                specializations: transformFormValuesToSpecializations(values),
                businessHours: values.businessHours || '',
            };

            if (data) {
                try {
                    await updateCompany({
                        companyId: data.publicId,
                        data: newValues,
                    }).unwrap();
                    setDisabled(true);
                    toast.success(t<string>('company-update-success'));
                } catch (e) {
                    return parseValidationFields(e);
                }
            }
        },
        [data, updateCompany],
    );

    const onChangeHandler = () => {
        if (formRef.current) {
            setDisabled(!Object.keys(formRef.current.getState().dirtyFields).length);
        }
    };

    return { onChangeHandler, handleSubmit, disabledSubmit, formRef };
};
