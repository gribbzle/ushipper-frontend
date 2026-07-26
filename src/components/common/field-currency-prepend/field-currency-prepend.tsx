import React from 'react';

import { classname } from '@utils';

import './field-currency-prepend.scss';

const cn = classname('field-currency-prepend');

export const FieldCurrencyPrepend = () => <span className={cn()}>$</span>;
