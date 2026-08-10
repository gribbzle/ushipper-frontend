import { UserRoleGroup } from '@/enums/user-role-group';
import { wrapper } from '@store';
import { authorizedUserSelector } from '@store/global';

type WrapperGetServerSideProps = typeof wrapper.getServerSideProps;

export const clientOnlyGetServerSideProps: WrapperGetServerSideProps = func => {
    return wrapper.getServerSideProps(store => async (...args) => {
        const authorizedUser = authorizedUserSelector(store.getState());

        if (!authorizedUser || authorizedUser.roleGroup === UserRoleGroup.ADMINISTRATORS) {
            return {
                redirect: {
                    destination: '/sign-in',
                    permanent: false,
                },
            };
        }

        return func(store)(...args);
    });
};

export const emptyClientOnlyGetServerSideProps = clientOnlyGetServerSideProps(() => async () => {
    return { props: {} };
});

export const adminOnlyGetServerSideProps: WrapperGetServerSideProps = func => {
    return wrapper.getServerSideProps(store => async (...args) => {
        const authorizedUser = authorizedUserSelector(store.getState());

        if (!authorizedUser || authorizedUser.roleGroup !== UserRoleGroup.ADMINISTRATORS) {
            return {
                redirect: {
                    destination: '/admin/sign-in',
                    permanent: false,
                },
            };
        }

        return func(store)(...args);
    });
};

export const emptyAdminOnlyGetServerSideProps = adminOnlyGetServerSideProps(() => async () => {
    return { props: {} };
});
