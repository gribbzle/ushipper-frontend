import React from 'react';

import { Link } from '@/components/common/link/link';
import { classname } from '@utils/classname';

import './users-count-info.scss';

const cn = classname('users-count-info');

export const UsersCountInfo = ({ companyName, count }: { count: number; companyName: string }) => (
    <Link className={cn('')} onClick={e => e.stopPropagation()} href={{ pathname: '/admin/users', query: { company: companyName } }}>
        {count}
    </Link>
);
