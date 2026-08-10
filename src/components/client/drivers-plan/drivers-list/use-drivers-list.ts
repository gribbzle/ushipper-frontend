import { UserRoleType } from '@/enums/user-role-type';
import { useAppSelector } from '@store';
import { useGetUsersQuery } from '@store/api/users-api';
import { authorizedUserPublicIdSelector } from '@store/global';

export const useDriversList = () => {
    const userPublicId = useAppSelector(authorizedUserPublicIdSelector);

    const {
        data: driversPaginateData,
        isSuccess,
        isError,
        error,
    } = useGetUsersQuery({ superiorUserPublicId: userPublicId ?? '', roleType: UserRoleType.CARRIER_DRIVER, perPage: 10 }, { skip: !userPublicId });

    return { isSuccess, drivers: driversPaginateData?.data, isError, error };
};
