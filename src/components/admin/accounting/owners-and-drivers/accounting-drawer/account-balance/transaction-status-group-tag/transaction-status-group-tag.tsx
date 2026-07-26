import React from 'react';

import { classname } from '@utils';

import { TransactionStatusGroupTagProps } from './transaction-status-group-tag.types';

import './transaction-status-group-tag.scss';

const cn = classname('transaction-status-group-tag');

export const TransactionStatusGroupTag = ({ text, view }: TransactionStatusGroupTagProps) => <div className={cn('', { view })}>{text}</div>;
