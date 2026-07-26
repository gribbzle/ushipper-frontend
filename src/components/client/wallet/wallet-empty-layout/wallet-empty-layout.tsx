import React from 'react';

import { Paper } from '@components';
import { classname, translateByNamespace } from '@utils';

import './wallet-empty-layout.scss';

const cn = classname('wallet-empty-layout');
const t = translateByNamespace('client:wallet-page');

export const WalletEmptyLayout = () => <Paper bodyClassName={cn()} body={<h4 className={cn('title')}>{t('wallet-empty-label')}</h4>} />;
