import React from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { Button } from '@/components/common/button/button';
import { Paper } from '@/components/common/paper/paper';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AssignUserItemProps } from './assign-user-item.types';
import { useAssignUserItem } from './use-assign-user-item';

import './assign-user-item.scss';

const t = translateByNamespace('common:staff-table');
const cn = classname('assign-user-item');

export const AssignUserItem = ({ user, assigned }: AssignUserItemProps) => {
    const { handleClick } = useAssignUserItem(user.publicId, assigned);

    return (
        <Paper
            className={cn('paper', { assigned })}
            body={
                <div className={cn('', { assigned })}>
                    <div className={cn('content')}>
                        <Avatar src={user.avatar?.url} />
                        <div className={cn('info')}>
                            <div className={cn('name')}>{user.name}</div>
                            <div className={cn('role')}>{user.roleName}</div>
                        </div>
                    </div>
                    <div className={cn('actions')}>
                        <Button onClick={handleClick} view={assigned ? 'default' : 'primary'} size='medium'>
                            {assigned ? t('assigned') : t('assign')}
                        </Button>
                    </div>
                </div>
            }
        />
    );
};
