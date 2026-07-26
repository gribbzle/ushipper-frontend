import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './settings-block-wrapper.scss';

const cn = classname('settings-block-wrapper');

export const SettingsBlockWrapper = ({ children }: { children: ReactNode }) => <div className={cn()}>{children}</div>;
