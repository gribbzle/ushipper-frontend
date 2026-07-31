import React, { useCallback, useMemo } from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { OpenSupportChatButton } from '@/components/common/chats/open-support-chat-button/open-support-chat-button';
import { CompanyType } from '@/enums';
import { useChatsPermission } from '@hooks';
import { AccountingAccountOwnerUser, AccountingAccountParentData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';
import { getCompanyTypeTranslate } from '@utils/get-company-type-translate';
import { translateByNamespace } from '@utils/i18n';

import './driver-account-info-block.scss';

type Props = {
    childrenCount: number;
    parent: AccountingAccountParentData | null;
    ownerUser: AccountingAccountOwnerUser;
    name: string;
    publicId: string;
    onNameClick?: () => void;
};

const cn = classname('driver-info-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:table');
const tOwner = translateByNamespace('common:roles');

export const DriverAccountInfoBlock = ({ publicId, name, childrenCount, parent, ownerUser: { avatar }, onNameClick }: Props) => {
    const hasChatsPermission = useChatsPermission();

    const handleDriversCountClick = useCallback(
        async (event: React.MouseEvent) => {
            event.stopPropagation();

            if (!!childrenCount) {
                window.open(`drivers?parentId=${publicId}`, '_blank');
            }
        },
        [childrenCount, publicId],
    );

    const handleDriverOwnerClick = useCallback(
        async (event: React.MouseEvent) => {
            event.stopPropagation();

            if (parent) {
                window.open(`drivers?name=${encodeURIComponent(parent.name)}`, '_blank');
            }
        },
        [parent],
    );

    const role = useMemo(() => (parent ? getCompanyTypeTranslate(CompanyType.DRIVER) : t('driver-owner')), [parent]);

    return (
        <div className={cn()}>
            <div className={cn('user')}>
                <Avatar src={avatar?.url} />
                <div>
                    <div className={cn('name-and-button', { margin: !parent })}>
                        <h4 className={cn('name', { hovered: !!onNameClick })} onClick={onNameClick}>
                            {name}
                        </h4>
                        {hasChatsPermission && <OpenSupportChatButton name={name} accountId={publicId} />}
                    </div>

                    <div className={cn('role-and-link')}>
                        <p className={cn('role')}>{role}</p>
                        {!parent && (
                            <p className={cn('link', { disabled: !childrenCount })} onClick={handleDriversCountClick}>
                                ({t('drivers-count', { count: childrenCount })})
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {parent && (
                <div className={cn('driver-owner')}>
                    {tOwner('carrier-owner')}:
                    <p onClick={handleDriverOwnerClick} className={cn('link', { owner: true })}>
                        {parent.name}
                    </p>
                </div>
            )}
        </div>
    );
};
