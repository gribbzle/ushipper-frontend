import React from 'react';

import { fromLangCodeToFlag } from './from-lang-code-to-flag';

import './flag.scss';

export const Flag = ({ langCode }: { langCode: string }) => {
    const FlagComponent = fromLangCodeToFlag.get(langCode);

    return FlagComponent && <FlagComponent className='flag' />;
};
