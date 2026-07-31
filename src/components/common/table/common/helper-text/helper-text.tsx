import React from 'react';

import { classname } from '@utils/classname';

import './helper-text.scss';

const cn = classname('helper-text');

export const HelperText = ({ text }: { text: string }) => <p className={cn()}>{text}</p>;
