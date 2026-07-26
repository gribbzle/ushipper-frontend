import React from 'react';

import { Flag, InfoListBody } from '@/components/common';
import { Language } from '@store/global/types';

export const DispatcherLanguages = ({ languages }: { languages: Language[] }) => {
    return <InfoListBody items={languages.map(({ language }) => language)} renderItem={item => <Flag key={item} langCode={item} />} />;
};
