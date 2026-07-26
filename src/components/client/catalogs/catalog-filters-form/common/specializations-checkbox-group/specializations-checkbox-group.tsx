import React from 'react';
import { Field } from 'react-final-form';

import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { LabeledCheckboxInput } from '@fields';
import { useIsDispatchersCatalogPage, useIsDriversCatalogPage } from '@hooks';
import { getTransportServiceTranslate, translateByNamespace } from '@utils';

import { SpecializationCategoriesCheckBoxGroup } from '../specialization-categories-checkbox-group';

import { useSpecializationsCheckBoxGroup } from './use-specializations-checkbox-group';

export const SpecializationsCheckBoxGroup = () => {
    const { handleCheckboxChange, selectedSpecializations, specializations, anySpecialization, onChangeAnySpecialization } = useSpecializationsCheckBoxGroup();
    const { isDispatchersCatalogPage } = useIsDispatchersCatalogPage();
    const { isDriversCatalogPage } = useIsDriversCatalogPage();
    const t = translateByNamespace('client:catalogs.filters');

    return (
        <>
            <NativeSwitch label={t('any-specialization-switch')} checked={anySpecialization} onChange={onChangeAnySpecialization} />
            {specializations.map(specialization => (
                <React.Fragment key={specialization.id}>
                    <Field
                        name={`specialization-${specialization.name}`}
                        render={({ input }) => (
                            <LabeledCheckboxInput
                                label={getTransportServiceTranslate(specialization.name)}
                                input={{
                                    ...input,
                                    value: selectedSpecializations.includes(specialization.id),
                                    checked: selectedSpecializations.includes(specialization.id),
                                    onChange: () => handleCheckboxChange(specialization.id),
                                }}
                                meta={{}}
                            />
                        )}
                    />
                    {(isDispatchersCatalogPage || isDriversCatalogPage) && selectedSpecializations.includes(specialization.id) && (
                        <SpecializationCategoriesCheckBoxGroup specializationId={specialization.id} />
                    )}
                </React.Fragment>
            ))}
        </>
    );
};
