import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/common/button/button';
import { Paper } from '@/components/common/paper/paper';
import { UserRoleGroup } from '@/enums';
import { useUserRoleGroup } from '@hooks';
import { ExternalLinkIcon } from '@icons';
import { useAppDispatch } from '@store';
import { staffActions } from '@store/common/staff/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './no-drivers-stub.scss';

const t = translateByNamespace('client:tracking-page');
const cn = classname('no-drivers-stub-paper');

export const NoDriversStub = () => {
    const dispatch = useAppDispatch();

    const router = useRouter();

    const userRoleGroup = useUserRoleGroup();

    const onAddUserClickHandler = useCallback(() => {
        router.push('staff');
        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'create', userId: null }));
    }, [dispatch, router]);

    const paperBody = useMemo(() => {
        return (
            <div className={cn('body-container')}>
                <span>{userRoleGroup === UserRoleGroup.SHIPPERS ? t('no-accepted-offers-or-drivers') : t('you-have-no-drivers-yet')}</span>
                {userRoleGroup !== UserRoleGroup.SHIPPERS && (
                    <Button view='primary' onClick={onAddUserClickHandler}>
                        <ExternalLinkIcon /> {t('add-driver')}
                    </Button>
                )}
            </div>
        );
    }, [onAddUserClickHandler, userRoleGroup]);

    return <Paper className={cn('')} body={paperBody} />;
};
