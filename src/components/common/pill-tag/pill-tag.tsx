import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import { Tag } from '../tag';

import './pill-tag.scss';

const cn = classname('pill-tag');

export const PillTag = ({ children }: { children: ReactNode }) => <Tag className={cn()}>{children}</Tag>;
