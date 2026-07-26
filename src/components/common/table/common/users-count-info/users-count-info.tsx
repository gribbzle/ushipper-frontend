import React from 'react';

import { Link } from '@/components/common';
import { classname } from '@utils';

import './users-count-info.scss';

const cn = classname('users-count-info');

export const UsersCountInfo = ({ companyName, count }: { count: number; companyName: string }) => (
    <Link className={cn('')} onClick={e => e.stopPropagation()} href={{ pathname: '/admin/users', query: { company: companyName } }}>
        {count}
    </Link>
);
