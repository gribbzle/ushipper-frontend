import React from 'react';

import { classname } from '@utils';

import './labeled-text.scss';

type LabeledTextProps = {
    label: string;
    value: string | number;
};

const cn = classname('labeled-text');

export const LabeledText = ({ label, value }: LabeledTextProps) => (
    <div className={cn('')}>
        <label>{label}</label>
        <span>{value}</span>
    </div>
);
