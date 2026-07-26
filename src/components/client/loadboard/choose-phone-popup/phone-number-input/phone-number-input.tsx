import { MaskProps } from '@react-input/mask';
import React, { useEffect, useMemo, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { DarkInput } from '@/fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:loadboard:calling');

export const PhoneNumberInput = (props: FieldRenderProps<string>) => {
    const [currentPhoneMask, setCurrentPhoneMask] = useState<MaskProps>({ mask: '(___) ___-____', replacement: { _: /\d/ } });

    const byPhoneMask = useMemo<MaskProps>(() => ({ mask: '+___ (__) ___-__-__', replacement: { _: /\d/ } }), []);

    const usPhoneMask = useMemo<MaskProps>(() => ({ mask: '(___) ___-____', replacement: { _: /\d/ } }), []);

    useEffect(() => {
        const phoneNumber = props.input.value;

        const isBelarusPhone = /^(\+375|\(375\))/.test(phoneNumber);

        if (isBelarusPhone) {
            setCurrentPhoneMask(byPhoneMask);
        } else {
            setCurrentPhoneMask(usPhoneMask);
        }
    }, [props.input.value, byPhoneMask, usPhoneMask, setCurrentPhoneMask]);

    return <DarkInput {...props} mask={currentPhoneMask} placeholder={t('enter-the-number')} />;
};
