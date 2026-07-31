import React from 'react';

import { Flag } from '@/components/common/flag/flag';
import { InfoListBody } from '@/components/common/info-list/info-list-body/info-list-body';
import { Language } from '@store/global/types';

export const DispatcherLanguages = ({ languages }: { languages: Language[] }) => {
    return <InfoListBody items={languages.map(({ language }) => language)} renderItem={item => <Flag key={item} langCode={item} />} />;
};
