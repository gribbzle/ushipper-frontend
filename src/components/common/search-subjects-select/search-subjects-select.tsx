import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { OffersSearchSubjectsEnum, SearchSubjectsEnum } from '@/enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order-search-subjects');

export const SearchSubjectsSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(props.offers ? OffersSearchSubjectsEnum : SearchSubjectsEnum).map(searchSubject => ({
                label: t(toKebabCase(searchSubject)),
                value: searchSubject,
            })),
        [props.offers],
    );

    return <SelectField options={options} {...props} />;
};
